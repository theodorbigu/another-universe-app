# Stripe Payment Testing Guide

## Test Credit Cards

Use these test card numbers:

| Card Type | Number |
|-----------|--------|
| Success | 4242 4242 4242 4242 |
| Authentication required | 4000 0025 0000 3155 |
| Insufficient funds | 4000 0000 0000 9995 |

## Testing Steps

1. Click "Purchase Now" on any credit package
2. You'll be redirected to Stripe Checkout
3. Fill in test card details:
   - Card number: `4242 4242 4242 4242`
   - Any future expiration date (e.g., `12/34`)
   - Any 3-digit CVC
   - Any name and postal code
4. Complete the checkout
5. You'll be redirected back to your PaymentSuccess page

## Testing Webhook Events

If you need to test webhooks locally:

1. Install Stripe CLI: [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)
2. Run:
   ```bash
   stripe listen --forward-to http://localhost:5001/api/payments/webhook
   ```

## Common Issues and Tips

- Make sure your backend server is running (port 5001)
- Check that your Stripe test API keys are set correctly in the backend
- The test cards will only work in test mode, not with live API keys
- For declined payments, use the appropriate test card number

This allows you to test the full payment flow without making real charges.