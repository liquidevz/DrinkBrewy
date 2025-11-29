# Shiprocket Checkout Integration Guide

## Overview

This project uses **Shiprocket Checkout** (formerly Fastrr Checkout) - a complete checkout solution that handles:
- ✅ Address collection (autofilled for returning customers)
- ✅ Payment processing (UPI, Cards, Wallets, COD)
- ✅ Shipping calculation
- ✅ Order creation
- ✅ Shipment generation

**No need to manually collect addresses** - Shiprocket Checkout widget does everything!

## Setup Steps

### 1. Sign Up for Shiprocket Checkout

1. Go to https://checkout.shiprocket.in/
2. Click "Get Started" or "Sign Up"
3. Complete the registration process
4. You'll get access to the Shiprocket Checkout dashboard

### 2. Get Your Credentials

After signing up, you need:

1. **Shiprocket API Credentials** (for order management):
   - Go to https://app.shiprocket.in
   - Settings → API → Generate API User
   - Note down: `Email` and `Password`

2. **Shiprocket Checkout Merchant ID**:
   - Go to Shiprocket Checkout dashboard
   - Settings → Integration
   - Copy your `Merchant ID`

3. **Checkout Widget Script**:
   - The widget script is already included: `https://checkout.shiprocket.in/checkout.js`

### 3. Configure Environment Variables

Add these to your `.env.local`:

```bash
# Shiprocket API Credentials
SHIPROCKET_EMAIL=your_api_email@example.com
SHIPROCKET_PASSWORD=your_api_password

# Shiprocket Checkout
SHIPROCKET_MERCHANT_ID=your_merchant_id

# Your site URL (for return URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. How It Works

#### User Flow:
1. User adds products to cart
2. Clicks "Proceed to Checkout"
3. **Shiprocket Checkout widget opens** (modal/popup)
4. Widget shows:
   - Order summary
   - Address form (autofilled if returning customer)
   - Delivery date estimation
   - Payment options (UPI, Cards, Wallets, COD)
5. User completes payment
6. Order automatically created in Shiprocket
7. Shipment automatically generated
8. User redirected to success page

#### Technical Flow:
```
Frontend Cart
    ↓
ShiprocketCheckout Component
    ↓
API: /api/shiprocket/create-checkout
    ↓
Shiprocket API: Generate Checkout Token
    ↓
Shiprocket Checkout Widget Opens
    ↓
User Completes Checkout
    ↓
Shiprocket Handles: Payment + Shipping + Order
    ↓
Success Callback → Clear Cart
```

## Implementation Details

### Files Created

1. **`src/components/ShiprocketCheckout.tsx`**
   - Loads Shiprocket Checkout widget script
   - Initializes checkout with token
   - Handles success/error callbacks

2. **`src/app/api/shiprocket/create-checkout/route.ts`**
   - Authenticates with Shiprocket
   - Creates checkout session
   - Returns checkout token

3. **`src/components/Cart.tsx`**
   - Updated to use ShiprocketCheckout component
   - Displays cart items and total
   - Triggers checkout on button click

### Widget Features

The Shiprocket Checkout widget automatically provides:

- ✅ **95% Autofilled Addresses** - Returning customers don't re-enter info
- ✅ **One-Click Checkout** - Minimal steps
- ✅ **Multiple Payment Options** - UPI, Cards, Wallets, Net Banking, COD
- ✅ **Estimated Delivery Date** - Shows delivery timeline
- ✅ **COD Verification** - Reduces RTO
- ✅ **Mobile Optimized** - Works perfectly on mobile
- ✅ **Secure** - PCI DSS compliant
- ✅ **Smart Discounts** - Apply coupons automatically
- ✅ **Address Validation** - Ensures deliverable addresses

## Testing

### Test Mode

Shiprocket Checkout provides test mode for development:

1. Use test credentials from dashboard
2. Test payments won't charge real money
3. Orders created in test mode are marked as test

### Test Flow

```bash
# Start backend
cd backend && npm run dev

# Start frontend
npm run dev

# Visit http://localhost:3000
# Add items to cart
# Click checkout
# Widget should open (if credentials are configured)
```

## Production Deployment

### Before Going Live:

1. ✅ Complete KYC verification on Shiprocket
2. ✅ Set up payment gateway (Shiprocket Payments or your own)
3. ✅ Configure shipping rates
4. ✅ Set up pickup addresses
5. ✅ Switch to production credentials
6. ✅ Test complete checkout flow
7. ✅ Configure webhook URLs for order updates

### Environment Variables (Production):

```bash
SHIPROCKET_EMAIL=production_email@yourdomain.com
SHIPROCKET_PASSWORD=production_password
SHIPROCKET_MERCHANT_ID=production_merchant_id
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Customization

### Widget Appearance

You can customize the widget appearance from Shiprocket Checkout dashboard:
- Colors and branding
- Logo
- Custom fields
- Discount display
- COD charges

### Webhook Integration

Set up webhooks to receive real-time updates:
- Order placed
- Payment successful
- Shipment created
- Delivery status

Configure webhook URL in Shiprocket dashboard:
```
https://yourdomain.com/api/shiprocket/webhook
```

## Troubleshooting

### Widget Not Opening

1. Check if script loaded: Open DevTools → Network → Look for `checkout.js`
2. Check console for errors
3. Verify merchant ID is correct
4. Ensure checkout token is generated successfully

### Authentication Errors

1. Verify `SHIPROCKET_EMAIL` and `SHIPROCKET_PASSWORD`
2. Check if API user is active in Shiprocket dashboard
3. Ensure credentials have necessary permissions

### Orders Not Creating

1. Check Shiprocket dashboard for test orders
2. Verify webhook configuration
3. Check API logs in `/api/shiprocket/create-checkout`

## Support

- **Shiprocket Checkout Docs**: https://checkout.shiprocket.in/
- **Shiprocket API Docs**: https://apidocs.shiprocket.in/
- **Support**: support@shiprocket.in

## Benefits

### Why Shiprocket Checkout?

1. **70% Faster Checkout** - Compared to traditional forms
2. **30% RTO Reduction** - Smart COD verification
3. **25% Less Cart Abandonment** - Simplified process
4. **60% Increased Conversions** - One-click experience
5. **No Address Forms** - Autofilled for returning customers
6. **Integrated Shipping** - Automatic shipment creation
7. **Multiple Payment Options** - All major methods supported

## Current Status

✅ **Implemented**:
- Shiprocket Checkout widget integration
- Checkout token generation
- Cart integration
- Success/error handling

⚠️ **Requires Configuration**:
- Shiprocket Checkout merchant account
- Merchant ID from dashboard
- Production credentials

📝 **Next Steps**:
1. Sign up for Shiprocket Checkout
2. Get merchant ID
3. Add to environment variables
4. Test the complete flow
5. Go live!
