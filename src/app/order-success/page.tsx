"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('brewy-cart');
    }

    // Redirect to home after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-4">
          Order Placed Successfully! 🎉
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for your order! We've received your payment and will start processing your order shortly.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            You will receive an order confirmation email with tracking details soon.
          </p>
        </div>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-[#C41E3A] text-white py-3 rounded-lg font-bold uppercase hover:bg-[#A01828] transition"
        >
          Continue Shopping
        </button>

        <p className="text-xs text-gray-500 mt-4">
          Redirecting to homepage in 5 seconds...
        </p>
      </div>
    </div>
  );
}
