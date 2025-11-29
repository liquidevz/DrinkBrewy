"use client";
import { useState } from 'react';

interface CartItem {
  id: string;
  variantId: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

interface ShiprocketCheckoutProps {
  amount: number;
  items: CartItem[];
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export default function ShiprocketCheckout({ amount, items, onSuccess, onError }: ShiprocketCheckoutProps) {
  const [loading, setLoading] = useState(false);
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
      // Prepare items for shipment
      const shipmentItems = items.map(item => ({
        name: item.name,
        sku: item.variantId,
        quantity: item.quantity,
        price: item.price,
        weight: 0.35 // kg per item
      }));

      // Create order with Shiprocket
      const orderRes = await fetch('/api/shiprocket/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          items: shipmentItems,
          amount
        })
      });
      
      const result = await orderRes.json();
      
      if (result.success) {
        // Show success message
        alert(`Order placed successfully! Order ID: ${result.orderId}`);
        onSuccess?.();
      } else {
        throw new Error(result.error || 'Order creation failed');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="text-white text-sm mb-2 font-semibold">
        Shipping Information
      </div>
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
          placeholder="Phone (10 digits)"
          required
          pattern="[0-9]{10}"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
          className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <input
          type="text"
          placeholder="Complete Address"
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
          placeholder="Pincode (6 digits)"
          required
          pattern="[0-9]{6}"
          value={customerInfo.pincode}
          onChange={(e) => setCustomerInfo({...customerInfo, pincode: e.target.value})}
          className="col-span-2 px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-[#C41E3A] py-4 rounded-lg font-bold uppercase hover:bg-white/90 transition disabled:opacity-50 shadow-lg"
      >
        {loading ? 'Processing Order...' : 'Place Order (Cash on Delivery)'}
      </button>
      <p className="text-white/70 text-xs text-center">
        Powered by Shiprocket Faster
      </p>
    </form>
  );
}
