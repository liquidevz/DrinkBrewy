import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, cartId } = await req.json();

    const order = await razorpay.orders.create({
      amount,
      currency: currency || 'INR',
      receipt: `order_${Date.now()}`,
      notes: { cartId }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
  }
}