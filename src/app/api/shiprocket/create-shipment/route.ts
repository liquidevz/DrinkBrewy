import { NextRequest, NextResponse } from 'next/server';

let authToken: string | null = null;
let tokenExpiry: number | null = null;

async function getShiprocketToken() {
  // Check if token is still valid (tokens typically last 10 days)
  if (authToken && tokenExpiry && Date.now() < tokenExpiry) {
    return authToken;
  }

  const response = await fetch('https://apiv2.shiprocket.in/v1/external/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    })
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Shiprocket');
  }

  const data = await response.json();
  authToken = data.token;
  // Set token expiry to 9 days from now (tokens last 10 days)
  tokenExpiry = Date.now() + (9 * 24 * 60 * 60 * 1000);
  return authToken;
}

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, cartId, customerInfo, items } = await req.json();
    
    // Validate required fields
    if (!customerInfo || !items || items.length === 0) {
      return NextResponse.json({ 
        error: 'Missing required customer or items information' 
      }, { status: 400 });
    }

    const token = await getShiprocketToken();

    // Calculate totals
    const subTotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    // Calculate total dimensions and weight
    const totalWeight = items.reduce((sum: number, item: any) => 
      sum + ((item.weight || 0.35) * item.quantity), 0
    );

    // Create order in Shiprocket
    const orderData = {
      order_id: orderId,
      order_date: new Date().toISOString().split('T')[0],
      pickup_location: "Primary",
      billing_customer_name: customerInfo.name || "Customer",
      billing_last_name: customerInfo.lastName || "",
      billing_address: customerInfo.address || "Address Line 1",
      billing_address_2: customerInfo.address2 || "",
      billing_city: customerInfo.city || "Mumbai",
      billing_pincode: customerInfo.pincode || "400001",
      billing_state: customerInfo.state || "Maharashtra",
      billing_country: "India",
      billing_email: customerInfo.email || "customer@drinkbrewy.com",
      billing_phone: customerInfo.phone || "9999999999",
      shipping_is_billing: true,
      order_items: items.map((item: any) => ({
        name: item.name,
        sku: item.sku || `BREWY-${item.id}`,
        units: item.quantity,
        selling_price: item.price,
        discount: 0
      })),
      payment_method: "Prepaid",
      sub_total: subTotal,
      length: 10,
      breadth: 10,
      height: 15,
      weight: totalWeight
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
    
    if (!response.ok) {
      console.error('Shiprocket API error:', result);
      return NextResponse.json({ 
        error: 'Shipment creation failed', 
        details: result 
      }, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Shiprocket shipment creation failed:', error);
    return NextResponse.json({ 
      error: 'Shipment creation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
