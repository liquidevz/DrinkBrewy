"use client";
import { useState, useEffect } from 'react';

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

declare global {
  interface Window {
    ShiprocketCheckout?: any;
  }
}

export default function ShiprocketCheckout({ amount, items, onSuccess, onError }: ShiprocketCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [checkoutReady, setCheckoutReady] = useState(false);

  useEffect(() => {
    // Load Shiprocket Checkout script
    const script = document.createElement('script');
    script.src = 'https://checkout.shiprocket.in/checkout.js';
    script.async = true;
    script.onload = () => setCheckoutReady(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCheckout = async () => {
    if (!items.length || !checkoutReady) return;

    setLoading(true);
    
    try {
      // Create order in backend first
      const orderRes = await fetch('/api/shiprocket/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            name: item.name,
            sku: item.variantId,
            quantity: item.quantity,
            price: item.price,
            weight: 0.35
          })),
          amount
        })
      });
      
      const result = await orderRes.json();
      
      if (!result.success || !result.checkoutToken) {
        throw new Error(result.error || 'Failed to create checkout');
      }

      // Initialize Shiprocket Checkout widget
      if (window.ShiprocketCheckout) {
        const checkout = new window.ShiprocketCheckout({
          token: result.checkoutToken,
          onSuccess: (response: any) => {
            console.log('Checkout success:', response);
            onSuccess?.();
          },
          onError: (error: any) => {
            console.error('Checkout error:', error);
            onError?.(error);
            setLoading(false);
          },
          onClose: () => {
            setLoading(false);
          }
        });

        checkout.open();
      } else {
        throw new Error('Shiprocket Checkout not loaded');
      }
    } catch (error: any) {
      console.error('Checkout initialization error:', error);
      alert('Checkout failed: ' + error.message);
      onError?.(error);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading || !items.length || !checkoutReady}
      className="w-full bg-white text-[#C41E3A] py-4 rounded-lg font-bold uppercase hover:bg-white/90 transition disabled:opacity-50 shadow-lg"
    >
      {loading ? 'Opening Checkout...' : checkoutReady ? 'Proceed to Checkout' : 'Loading...'}
    </button>
  );
}
