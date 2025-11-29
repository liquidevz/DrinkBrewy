import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Generate HMAC SHA256 signature
function generateHMAC(body: any, secretKey: string): string {
  const bodyString = JSON.stringify(body);
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(bodyString);
  return hmac.digest('base64');
}

export async function POST(request: NextRequest) {
  try {
    const { items } = await request.json();

    const apiKey = process.env.SHIPROCKET_CHECKOUT_API_KEY;
    const secretKey = process.env.SHIPROCKET_CHECKOUT_SECRET_KEY;
    const redirectUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (!apiKey || !secretKey) {
      throw new Error('Shiprocket Checkout credentials not configured');
    }

    // Prepare cart data for Shiprocket
    const requestBody = {
      cart_data: {
        items: items.map((item: any) => ({
          variant_id: item.variantId,
          quantity: item.quantity
        }))
      },
      redirect_url: `${redirectUrl}/order-success`,
      timestamp: new Date().toISOString()
    };

    // Generate HMAC signature
    const hmacSignature = generateHMAC(requestBody, secretKey);

    // Call Shiprocket Checkout API to generate access token
    const response = await fetch('https://checkout-api.shiprocket.com/api/v1/access-token/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
        'X-Api-HMAC-SHA256': hmacSignature
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate checkout token');
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      token: data.result?.token,
      orderId: data.result?.order_id
    });

  } catch (error: any) {
    console.error('Shiprocket checkout token error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
