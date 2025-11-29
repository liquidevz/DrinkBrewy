"use client";
import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface RazorpayCheckoutProps {
  amount: number;
  items: CartItem[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function RazorpayCheckout({ amount, items, onSuccess, onError }: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return;

    setLoading(true);
    
    try {
      // Create Razorpay order
      const orderRes = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          receipt: `order_${Date.now()}`
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
            const shipmentItems = items.map(item => ({
              name: item.name,
              sku: item.variantId,
              quantity: item.quantity,
              price: item.price,
              weight: 0.35 // kg per item
            }));

            // Verify payment and create shipment
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order.receipt,
                customerInfo,
                items: shipmentItems,
                amount
              })
            });
            
            const result = await verifyRes.json();
            
            if (result.success) {
              onSuccess?.();
            } else {
              throw new Error(result.error || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Payment handler error:', error);
            onError?.(error);
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone
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

  if (!showForm) {
    return (
      <button
        onClick={() => setShowForm(true)}
        disabled={!items.length}
        className="w-full bg-white text-[#C41E3A] py-4 rounded-lg font-bold uppercase hover:bg-white/90 transition disabled:opacity-50 shadow-lg"
      >
        Proceed to Checkout
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Full Name"
          required
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
          className="col-span-2 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={customerInfo.email}
          onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
          className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <input
          type="tel"
          placeholder="Phone"
          required
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
          className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <input
          type="text"
          placeholder="Address"
          required
          value={customerInfo.address}
          onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
          className="col-span-2 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <input
          type="text"
          placeholder="City"
          required
          value={customerInfo.city}
          onChange={(e) => setCustomerInfo({...customerInfo, city: e.target.value})}
          className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <input
          type="text"
          placeholder="State"
          required
          value={customerInfo.state}
          onChange={(e) => setCustomerInfo({...customerInfo, state: e.target.value})}
          className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <input
          type="text"
          placeholder="Pincode"
          required
          pattern="[0-9]{6}"
          value={customerInfo.pincode}
          onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value})}
          className="col-span-2 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="flex-1 bg-white/20 text-white py-3 rounded-lg font-bold uppercase hover:bg-white/30 transition"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-white text-[#C41E3A] py-3 rounded-lg font-bold uppercase hover:bg-white/90 transition disabled:opacity-50 shadow-lg"
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}
