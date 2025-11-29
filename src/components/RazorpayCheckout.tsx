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
      
      if (!orderRes.ok) {
        throw new Error('Failed to create order');
      }

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
            // Prepare items for shipment
            const items = cart.lines.map(line => ({
              id: line.merchandise.id,
              name: line.merchandise.product.title,
              sku: line.merchandise.sku || `BREWY-${line.merchandise.id}`,
              quantity: line.quantity,
              price: parseFloat(line.cost.totalAmount.amount) / line.quantity,
              weight: 0.35
            }));

            // Get customer info from Razorpay response
            const customerInfo = {
              name: response.razorpay_contact_name || 'Customer',
              email: response.razorpay_contact_email || 'customer@drinkbrewy.com',
              phone: response.razorpay_contact_phone || '9999999999',
              address: response.razorpay_billing_address || 'Address',
              city: response.razorpay_billing_city || 'Mumbai',
              state: response.razorpay_billing_state || 'Maharashtra',
              pincode: response.razorpay_billing_pincode || '400001'
            };

            // Verify payment and create shipment
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                cartId: cart.id,
                orderId: order.receipt,
                customerInfo,
                items
              })
            });
            
            const result = await verifyRes.json();
            
            if (result.success) {
              clearCart();
              onSuccess?.();
            } else {
              throw new Error(result.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment handler error:', error);
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
      rzp.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        onError?.(new Error(response.error.description));
        setLoading(false);
      });
      
      rzp.open();
    } catch (error) {
      console.error('Checkout error:', error);
      onError?.(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !cart?.lines.length}
      className="w-full bg-white text-[#C41E3A] py-4 rounded-lg font-bold uppercase hover:bg-white/90 transition disabled:opacity-50 shadow-lg"
    >
      {loading ? 'Processing...' : 'Proceed to Checkout'}
    </button>
  );
}
