const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const supabase = require("../supabaseClient");
const { verifyToken } = require("../middleware/auth");

// Define credit packages
const CREDIT_PACKAGES = [
  { id: "small", name: "Small Credit Pack", credits: 10, price: 499 }, // $4.99
  { id: "medium", name: "Medium Credit Pack", credits: 30, price: 1000 }, // $10.00
  { id: "large", name: "Large Credit Pack", credits: 100, price: 2500 }, // $25.00
];

/**
 * POST /create-checkout-session
 * Create Stripe checkout session for credit purchase
 */
router.post("/create-checkout-session", verifyToken, async (req, res) => {
  try {
    const { packageId } = req.body;
    const userId = req.user.uid;

    // Find the selected package
    const selectedPackage = CREDIT_PACKAGES.find((pkg) => pkg.id === packageId);
    if (!selectedPackage) {
      return res.status(400).json({ error: "Invalid package selection" });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: selectedPackage.name,
              description: `${selectedPackage.credits} credits for your account`,
            },
            unit_amount: selectedPackage.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        credits: selectedPackage.credits,
        packageId: selectedPackage.id,
      },
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/profile`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

/**
 * POST /webhook
 * Handle Stripe webhook events
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Add credits to user account
      try {
        // Retrieve user ID and credit amount from session metadata
        const { userId, credits } = session.metadata;

        // Get current user credit balance
        const { data: userData, error: fetchError } = await supabase
          .from("users")
          .select("credits")
          .eq("uid", userId)
          .single();

        if (fetchError) {
          console.error("Error fetching user for credit update:", fetchError);
          return res.status(400).json({ error: "Failed to find user" });
        }

        const currentCredits = userData.credits || 0;
        const newCredits = currentCredits + parseInt(credits);

        // Update user's credit balance
        const { error: updateError } = await supabase
          .from("users")
          .update({ credits: newCredits })
          .eq("uid", userId);

        if (updateError) {
          console.error("Error updating user credits:", updateError);
          return res.status(500).json({ error: "Failed to update credits" });
        }

        // Log the transaction
        const { error: logError } = await supabase
          .from("credit_transactions")
          .insert({
            user_id: userId,
            amount: parseInt(credits),
            action_type: "PURCHASE",
            description: `Purchased ${credits} credits with Stripe`,
          });

        if (logError) {
          console.error("Error logging credit transaction:", logError);
        }
      } catch (err) {
        console.error("Error processing successful payment:", err);
      }
    }

    res.json({ received: true });
  }
);

/**
 * GET /packages
 * Get available credit packages
 */
router.get("/packages", async (req, res) => {
  res.json({ packages: CREDIT_PACKAGES });
});

/**
 * GET /payment-status/:sessionId
 * Verify the payment status for a specific session
 */
router.get("/payment-status/:sessionId", verifyToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json({
      status: session.status,
      payment_status: session.payment_status,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(500).json({ error: "Failed to retrieve payment status" });
  }
});

module.exports = router;
