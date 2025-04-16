const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const { verifyToken } = require("../middleware/auth");

/**
 * Save user to Supabase
 * This endpoint accepts user data and saves it to Supabase
 * Protected by Firebase auth - requires valid token
 */
router.post("/save-user", verifyToken, async (req, res) => {
  try {
    const { uid, email, displayName } = req.body;

    // Validate input
    if (!uid || !email) {
      return res.status(400).json({ error: "UID and email are required" });
    }

    // Ensure the requesting user can only save their own data
    if (uid !== req.user.uid) {
      return res
        .status(403)
        .json({ error: "Forbidden: You can only save your own user data" });
    }

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 is "no rows returned" error
      console.error("Error checking for existing user:", fetchError);
      return res
        .status(500)
        .json({ error: "Database error when checking for existing user" });
    }

    let result;
    if (existingUser) {
      // Update existing user
      const { data, error } = await supabase
        .from("users")
        .update({
          email: email,
          display_name: displayName || existingUser.display_name,
          updated_at: new Date().toISOString(),
        })
        .eq("uid", uid)
        .select();

      if (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Failed to update user" });
      }

      result = data[0];
    } else {
      // Create new user
      const { data, error } = await supabase
        .from("users")
        .insert({
          uid: uid,
          email: email,
          display_name: displayName || "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({ error: "Failed to create user" });
      }

      result = data[0];
    }

    // Return success response
    res.status(200).json({
      message: existingUser
        ? "User updated successfully"
        : "User created successfully",
      user: result,
    });
  } catch (error) {
    console.error("Error in save-user endpoint:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * Get current user profile
 * Returns the user's profile from Supabase
 * Protected by Firebase auth - requires valid token
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", req.user.uid)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return res.status(404).json({ error: "User profile not found" });
    }

    res.status(200).json({ user: data });
  } catch (error) {
    console.error("Error in profile endpoint:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * GET /credits
 * Get user's current credit balance
 */
router.get("/credits", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const { data, error } = await supabase
      .from("users")
      .select("credits")
      .eq("uid", userId)
      .single();

    if (error) {
      console.error("Error fetching credits:", error);
      return res.status(500).json({ error: "Failed to fetch credit balance" });
    }

    return res.status(200).json({ credits: data.credits });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /credits/use
 * Deduct credits from user balance
 */
router.post("/credits/use", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid credit amount" });
    }

    // Start a Supabase transaction
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("uid", userId)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return res.status(500).json({ error: "Failed to check credit balance" });
    }

    // Check if user has enough credits
    if (userData.credits < amount) {
      return res.status(403).json({
        error: "Insufficient credits",
        credits: userData.credits,
        required: amount,
      });
    }

    // Update the user's credit balance
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - amount })
      .eq("uid", userId);

    if (updateError) {
      console.error("Error updating credits:", updateError);
      return res.status(500).json({ error: "Failed to update credit balance" });
    }

    // Log the transaction
    const { error: logError } = await supabase
      .from("credit_transactions")
      .insert({
        user_id: userId,
        amount: -amount,
        action_type: "USE",
        description: description || "Image edit",
      });

    if (logError) {
      console.error("Error logging transaction:", logError);
      // Continue anyway since the credit deduction was successful
    }

    return res.status(200).json({
      success: true,
      creditsRemaining: userData.credits - amount,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /credits/history
 * Get user's credit transaction history
 */
router.get("/credits/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const { data, error, count } = await supabase
      .from("credit_transactions")
      .select("*", { count: "exact" })
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching credit history:", error);
      return res.status(500).json({ error: "Failed to fetch credit history" });
    }

    return res.status(200).json({
      transactions: data,
      count,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
