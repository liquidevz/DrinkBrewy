import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, customerInfo, amount } = body;

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

    // Create order with Shiprocket Faster
    const orderData = {
      order_id: `BREWY-${Date.now()}`,
      order_date: new Date().toISOString().split('T')[0],
      billing_customer_name: customerInfo.name,
      billing_last_name: "",
      billing_address: customerInfo.address,
      billing_city: customerInfo.city,
      billing_pincode: customerInfo.pincode,
      billing_state: customerInfo.state,
      billing_country: "India",
      billing_email: customerInfo.email,
      billing_phone: customerInfo.phone,
      shipping_is_billing: true,
      order_items: items.map((item: any) => ({
        name: item.name,
        sku: item.sku,
        units: item.quantity,
        selling_price: item.price,
        discount: 0
      })),
      payment_method: "Prepaid",
      sub_total: amount,
      length: 10,
      breadth: 10,
      height: 10,
      weight: items.reduce((total: number, item: any) => total + (item.weight * item.quantity), 0)
    };

    const orderRes = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    if (!orderRes.ok) {
      const errorData = await orderRes.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const orderResult = await orderRes.json();

    return NextResponse.json({
      success: true,
      orderId: orderResult.order_id,
      shipmentId: orderResult.shipment_id,
      message: 'Order created successfully'
    });

  } catch (error: any) {
    console.error('Shiprocket order creation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
