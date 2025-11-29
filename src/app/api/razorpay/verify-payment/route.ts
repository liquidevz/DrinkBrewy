import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      cartId, 
      orderId,
      customerInfo,
      items 
    } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }

    // Create Shiprocket shipment with customer info
    try {
      const shipmentRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'}/api/shiprocket/create-shipment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          paymentId: razorpay_payment_id,
          cartId,
          customerInfo,
          items
        })
      });

      if (!shipmentRes.ok) {
        console.error('Shipment creation failed:', await shipmentRes.text());
        // Don't fail the payment if shipment creation fails
        return NextResponse.json({ 
          success: true, 
          paymentId: razorpay_payment_id,
          warning: 'Payment successful but shipment creation failed'
        });
      }

      const shipment = await shipmentRes.json();

      return NextResponse.json({ 
        success: true, 
        paymentId: razorpay_payment_id,
        shipmentId: shipment.shipment_id || shipment.order_id
      });
    } catch (shipmentError) {
      console.error('Shipment error:', shipmentError);
      // Payment was successful, so return success even if shipment fails
      return NextResponse.json({ 
        success: true, 
        paymentId: razorpay_payment_id,
        warning: 'Payment successful but shipment creation encountered an error'
      });
    }
  } catch (error) {
    console.error('Payment verification failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Verification failed' 
    }, { status: 500 });
  }
}
