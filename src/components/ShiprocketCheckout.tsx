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
    HeadlessCheckout?: any;
  }
}

export default function ShiprocketCheckout({ amount, items, onSuccess, onError }: ShiprocketCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Shiprocket Checkout CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = 'https://checkout-ui.shiprocket.com/assets/styles/shopify.css';
    document.head.appendChild(cssLink);

    // Load Shiprocket Checkout JS
    const script = document.createElement('script');
    script.src = 'https://checkout-ui.shiprocket.com/assets/js/channels/shopify.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      console.log('Shiprocket Checkout script loaded');
    };
    script.onerror = () => {
      console.error('Failed to load Shiprocket Checkout script');
    };
    document.body.appendChild(script);

    // Add hidden seller domain input (required by Shiprocket)
    if (!document.getElementById('sellerDomain')) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.id = 'sellerDomain';
      input.value = window.location.hostname;
      document.body.appendChild(input);
    }

    return () => {
      if (document.head.contains(cssLink)) {
        document.head.removeChild(cssLink);
      }
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleCheckout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!items.length || !scriptLoaded) {
      console.error('Checkout not ready');
      return;
    }

    setLoading(true);
    
    try {
      // Generate checkout token from backend
      const tokenRes = await fetch('/api/shiprocket/checkout-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
          }))
        })
      });
      
      const result = await tokenRes.json();
      
      if (!result.success || !result.token) {
        throw new Error(result.error || 'Failed to generate checkout token');
      }

      console.log('Checkout token generated:', result.token);

      // Open Shiprocket Checkout with token
      if (window.HeadlessCheckout && typeof window.HeadlessCheckout.addToCart === 'function') {
        const fallbackUrl = `${window.location.origin}/cart`;
        window.HeadlessCheckout.addToCart(e, result.token, { fallbackUrl });
        
        // Listen for checkout completion
        window.addEventListener('message', (event) => {
          if (event.data?.type === 'CHECKOUT_SUCCESS') {
            console.log('Checkout successful');
            onSuccess?.();
          } else if (event.data?.type === 'CHECKOUT_ERROR') {
            console.error('Checkout error:', event.data);
            onError?.(new Error('Checkout failed'));
          }
        });
      } else {
        throw new Error('Shiprocket Checkout not initialized');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert('Checkout failed: ' + error.message + '\n\nPlease ensure Shiprocket Checkout credentials are configured.');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleCheckout}
        disabled={loading || !items.length || !scriptLoaded}
        className="w-full bg-white text-[#C41E3A] py-4 rounded-lg font-bold uppercase hover:bg-white/90 transition disabled:opacity-50 shadow-lg"
      >
        {loading ? 'Opening Checkout...' : scriptLoaded ? 'Proceed to Checkout' : 'Loading Checkout...'}
      </button>
      <p className="text-white/70 text-xs text-center">
        Powered by Shiprocket Checkout - One-click checkout with autofilled addresses
      </p>
    </div>
  );
}
