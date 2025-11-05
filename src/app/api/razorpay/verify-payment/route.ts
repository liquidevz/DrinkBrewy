import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartId, orderId } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    // Create Shiprocket shipment
    const shipmentRes = await fetch('/api/shiprocket/create-shipment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        paymentId: razorpay_payment_id,
        cartId
      })
    });

    const shipment = await shipmentRes.json();

    return NextResponse.json({ 
      success: true, 
      paymentId: razorpay_payment_id,
      shipmentId: shipment.shipment_id 
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 });
  }
}