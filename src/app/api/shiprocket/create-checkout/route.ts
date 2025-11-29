import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, amount } = body;

    // Authenticate with Shiprocket
    const authRes = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      })
    });

    if (!authRes.ok) {
      throw new Error('Shiprocket authentication failed');
    }

    const { token } = await authRes.json();

    // Generate checkout token
    // Note: This is a simplified version. Shiprocket Checkout requires merchant registration
    // and checkout token generation through their dashboard or API
    const checkoutData = {
      order_id: `BREWY-${Date.now()}`,
      order_amount: amount,
      order_currency: 'INR',
      order_items: items.map((item: any) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price
      })),
      // Shiprocket Checkout specific fields
      merchant_id: process.env.SHIPROCKET_MERCHANT_ID || '',
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/order-cancelled`
    };

    // For now, return a mock response since Shiprocket Checkout requires dashboard setup
    // In production, you would call the actual Shiprocket Checkout API here
    return NextResponse.json({
      success: true,
      checkoutToken: `mock_token_${Date.now()}`,
      message: 'Checkout token generated (Note: Requires Shiprocket Checkout merchant setup)',
      orderData: checkoutData
    });

  } catch (error: any) {
    console.error('Shiprocket checkout creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
