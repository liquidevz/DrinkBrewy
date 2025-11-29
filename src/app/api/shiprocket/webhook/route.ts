import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Shiprocket webhook received:', JSON.stringify(body, null, 2));

    const {
      order_id,
      cart_data,
      status,
      phone,
      email,
      payment_type,
      total_amount_payable,
      shipping_address,
      billing_address
    } = body;

    if (status === 'SUCCESS') {
      // Order was successful
      console.log('Order successful:', {
        orderId: order_id,
        email,
        phone,
        paymentType: payment_type,
        amount: total_amount_payable,
        items: cart_data?.items
      });

      // Here you would:
      // 1. Save order to your database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Create shipment in Shiprocket (if not auto-created)

      // Example: Save to MongoDB (if you have order model)
      // await Order.create({
      //   shiprocketOrderId: order_id,
      //   customerEmail: email,
      //   customerPhone: phone,
      //   items: cart_data.items,
      //   totalAmount: total_amount_payable,
      //   paymentType: payment_type,
      //   shippingAddress: shipping_address,
      //   billingAddress: billing_address,
      //   status: 'confirmed'
      // });

      return NextResponse.json({
        success: true,
        message: 'Order received and processed'
      });
    } else {
      // Order failed or cancelled
      console.log('Order failed/cancelled:', order_id, status);
      
      return NextResponse.json({
        success: true,
        message: 'Order status noted'
      });
    }

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
