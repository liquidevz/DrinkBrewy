"use client";
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function RazorpayCheckout({ onSuccess, onError }: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const { cart, clearCart } = useCart();

  const handleCheckout = async () => {
    if (!cart || !cart.lines.length) return;

    setLoading(true);
    
    try {
      // Create Razorpay order
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(cart.cost.totalAmount.amount) * 100, // Convert to paise
          currency: cart.cost.totalAmount.currencyCode,
          cartId: cart.id
        })
      });
      
      const order = await orderRes.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'DrinkBrewy',
        description: 'Guilt-free Cola',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment and create shipment
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                cartId: cart.id,
                orderId: order.receipt
              })
            });
            
            const result = await verifyRes.json();
            
            if (result.success) {
              clearCart();
              onSuccess?.();
            } else {
              onError?.(new Error('Payment verification failed'));
            }
          } catch (error) {
            onError?.(error);
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        theme: { color: '#C41E3A' },
        modal: {
          ondismiss: () => setLoading(false)
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      onError?.(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !cart?.lines.length}
      className="w-full bg-[#C41E3A] text-white py-4 rounded font-bold uppercase hover:bg-[#A3182F] transition disabled:opacity-50"
    >
      {loading ? 'Processing...' : 'Pay with Razorpay'}
    </button>
  );
}