import { NextRequest, NextResponse } from 'next/server';

let authToken: string | null = null;

async function getShiprocketToken() {
  if (authToken) return authToken;

  const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    })
  });

  const data = await response.json();
  authToken = data.token;
  return authToken;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, cartId } = await req.json();
    const token = await getShiprocketToken();

    // Create order in Shiprocket
    const orderData = {
      order_id: orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary",
      billing_customer_name: "Customer",
      billing_last_name: "",
      billing_address: "Address",
      billing_city: "Mumbai",
      billing_pincode: "400001",
      billing_state: "Maharashtra",
      billing_country: "India",
      billing_email: "customer@example.com",
      billing_phone: "9999999999",
      shipping_is_billing: true,
      order_items: [{
        name: "DrinkBrewy Cola",
        sku: "BREWY001",
        units: 1,
        selling_price: 99,
        discount: 0
      }],
      payment_method: "Prepaid",
      sub_total: 99,
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Shiprocket shipment creation failed:', error);
    return NextResponse.json({ error: 'Shipment creation failed' }, { status: 500 });
  }
}