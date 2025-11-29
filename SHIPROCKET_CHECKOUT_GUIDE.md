# Shiprocket Checkout Integration - Complete Guide

## ✅ What's Implemented

Your DrinkBrewy website now has **full Shiprocket Checkout integration** based on their official API documentation.

### Features:
- ✅ **One-click checkout** - Minimal steps, maximum conversions
- ✅ **Autofilled addresses** - Returning customers don't re-enter info
- ✅ **Smart payment options** - UPI, Cards, Wallets, BNPL, COD
- ✅ **Address validation** - Reduces delivery errors and RTOs
- ✅ **Automatic shipping** - Shipment created automatically
- ✅ **Order webhooks** - Real-time order updates

## 🚀 How to Get Started

### Step 1: Sign Up for Shiprocket Checkout

1. Visit https://checkout.shiprocket.in/
2. Click "Get Started" or fill the form
3. Complete registration for your D2C brand

### Step 2: Contact Shiprocket for API Access

Since this is a custom website integration, you need to:

1. **Email Shiprocket**: Contact their team at support@shiprocket.com
2. **Request**: API access for custom website integration
3. **Provide**: Your website URL and business details
4. **Receive**: API Key & Secret Key from Shiprocket team

### Step 3: Configure Environment Variables

Once you receive credentials from Shiprocket, add them to `.env.local`:

\`\`\`bash
# Shiprocket Checkout API Credentials
SHIPROCKET_CHECKOUT_API_KEY=your_api_key_from_shiprocket
SHIPROCKET_CHECKOUT_SECRET_KEY=your_secret_key_from_shiprocket

# Your website URL (for redirect after checkout)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Shiprocket Shipping API (optional, for advanced features)
SHIPROCKET_EMAIL=your_shiprocket_email
SHIPROCKET_PASSWORD=your_shiprocket_password
\`\`\`

### Step 4: Register Webhook URL with Shiprocket

Provide this webhook URL to Shiprocket team:

**Development:**
\`\`\`
http://localhost:3000/api/shiprocket/webhook
\`\`\`

**Production:**
\`\`\`
https://yourdomain.com/api/shiprocket/webhook
\`\`\`

This webhook receives order details when customers complete checkout.

## 📋 How It Works

### User Flow:

1. **User adds products to cart**
2. **Clicks "Proceed to Checkout"**
3. **Shiprocket Checkout iframe opens** with:
   - Cart summary
   - Autofilled address (for returning customers)
   - Delivery date estimation
   - Payment options
4. **User completes checkout** in the iframe
5. **Order created** in Shiprocket
6. **Webhook sent** to your website with order details
7. **User redirected** to success page

### Technical Flow:

\`\`\`
Cart Component
    ↓
ShiprocketCheckout Component
    ↓
API: /api/shiprocket/checkout-token
    ↓
Shiprocket API: Generate Access Token
    ↓
Shiprocket Checkout Iframe Opens
    ↓
User Completes Checkout
    ↓
Shiprocket Sends Webhook to: /api/shiprocket/webhook
    ↓
Order Saved & User Redirected to /order-success
\`\`\`

## 🔧 Implementation Details

### Files Created:

1. **`src/components/ShiprocketCheckout.tsx`**
   - Loads Shiprocket checkout script
   - Generates access token
   - Opens checkout iframe
   - Handles success/error

2. **`src/app/api/shiprocket/checkout-token/route.ts`**
   - Generates HMAC signature
   - Calls Shiprocket API for access token
   - Returns token to frontend

3. **`src/app/api/shiprocket/webhook/route.ts`**
   - Receives order data from Shiprocket
   - Processes successful orders
   - Logs order details

4. **`src/app/order-success/page.tsx`**
   - Order confirmation page
   - Clears cart
   - Redirects to homepage

### Key Features:

#### HMAC Authentication
All API requests to Shiprocket are authenticated using HMAC SHA256:

\`\`\`typescript
const hmac = crypto.createHmac('sha256', secretKey);
hmac.update(JSON.stringify(requestBody));
const signature = hmac.digest('base64');
\`\`\`

#### Cart Data Format
Cart items are sent to Shiprocket in this format:

\`\`\`json
{
  "cart_data": {
    "items": [
      {
        "variant_id": "var_watermelon_single",
        "quantity": 1
      }
    ]
  },
  "redirect_url": "https://yourdomain.com/order-success",
  "timestamp": "2024-01-11T10:43:01.561Z"
}
\`\`\`

#### Webhook Payload
Shiprocket sends order details to your webhook:

\`\`\`json
{
  "order_id": "659fc40044f41a36bf1c556c",
  "status": "SUCCESS",
  "phone": "9999999999",
  "email": "customer@example.com",
  "payment_type": "CASH_ON_DELIVERY",
  "total_amount_payable": 224.0,
  "cart_data": {
    "items": [...]
  },
  "shipping_address": {...},
  "billing_address": {...}
}
\`\`\`

## 🧪 Testing

### Without Credentials (Current State):

The checkout button will show an error message asking you to configure credentials. This is expected until you receive API keys from Shiprocket.

### With Credentials:

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm run dev`
3. Add products to cart
4. Click "Proceed to Checkout"
5. Shiprocket iframe should open
6. Complete test checkout
7. Check webhook logs in terminal
8. Verify redirect to success page

## 📊 What Shiprocket Checkout Provides

### Automatic Features:

- ✅ **Address autofill** - 95% of addresses pre-filled for returning customers
- ✅ **Address validation** - Ensures deliverable addresses
- ✅ **Pincode serviceability** - Checks if delivery is available
- ✅ **Delivery date estimation** - Shows expected delivery
- ✅ **Payment gateway** - Multiple payment options
- ✅ **COD verification** - Reduces RTO by 30%
- ✅ **Order creation** - Automatic order in Shiprocket
- ✅ **Shipment generation** - Auto-creates shipment
- ✅ **Tracking** - Automatic tracking updates

### Performance Benefits:

- **70% faster checkout** vs traditional forms
- **30% RTO reduction** with COD verification
- **25% less cart abandonment** with one-click flow
- **60% increased conversions** with optimized UX

## 🔐 Security

- All API requests use HMAC SHA256 authentication
- Secret keys never exposed to frontend
- Checkout happens in Shiprocket's secure iframe
- PCI DSS compliant payment processing

## 📞 Next Steps

1. **Contact Shiprocket** - Email support@shiprocket.com for API access
2. **Provide website details** - Share your domain and business info
3. **Receive credentials** - Get API Key & Secret Key
4. **Configure .env.local** - Add credentials
5. **Register webhook** - Provide webhook URL to Shiprocket
6. **Test checkout** - Complete a test order
7. **Go live!** 🚀

## 💡 Important Notes

- **Shiprocket Checkout requires merchant approval** - You can't use it without contacting Shiprocket first
- **Catalog sync not required** - We're using direct cart data, not syncing products
- **Variant IDs** - Make sure your product variant IDs are unique and consistent
- **Webhook endpoint** - Must be publicly accessible (use ngrok for local testing)

## 🆘 Troubleshooting

### "Failed to generate checkout token"
- Check if API Key and Secret Key are correct
- Verify HMAC signature is generated correctly
- Check Shiprocket API status

### Checkout iframe not opening
- Verify script loaded: Check Network tab for `shopify.js`
- Check console for JavaScript errors
- Ensure `sellerDomain` input exists

### Webhook not receiving orders
- Verify webhook URL is registered with Shiprocket
- Check if endpoint is publicly accessible
- Look at server logs for incoming requests

## 📚 References

- **Official Documentation**: See `pasted_content.txt` for full API docs
- **Shiprocket Checkout**: https://checkout.shiprocket.in/
- **Shiprocket API**: https://apidocs.shiprocket.in/
- **Support**: support@shiprocket.com

---

**Your DrinkBrewy website is now ready for Shiprocket Checkout!** Just get the credentials from Shiprocket and you're good to go. 🎉
