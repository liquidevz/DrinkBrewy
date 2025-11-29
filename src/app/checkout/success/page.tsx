'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, ArrowRight, Loader2 } from 'lucide-react';

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const orderId = searchParams.get('order_id');
  const checkoutId = searchParams.get('checkout_id');

  useEffect(() => {
    if (checkoutId) {
      verifyCheckout();
    } else if (orderId) {
      fetchOrderStatus();
    } else {
      setError('No order information found');
      setLoading(false);
    }
  }, [checkoutId, orderId]);

  const verifyCheckout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/faster-checkout/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkoutId, orderId }),
      });

      const data = await response.json();

      if (data.success) {
        setOrderData(data.order);
      } else {
        setError(data.error || 'Failed to verify checkout');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify checkout');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/faster-checkout/status/${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrderData(data.data);
      } else {
        setError(data.error || 'Failed to fetch order status');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#C41E3A] animate-spin mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-700">Verifying your order...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-cream to-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Verification Failed</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#C41E3A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A3182F] transition-colors"
          >
            Return to Home
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-white text-center">
            <CheckCircle className="w-20 h-20 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-lg text-white/90">
              Thank you for your purchase. Your order has been successfully placed.
            </p>
          </div>

          <div className="p-8">
            {/* Order Details */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-6 h-6 text-[#C41E3A]" />
                Order Details
              </h2>
              <div className="bg-cream rounded-xl p-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Order ID:</span>
                  <span className="font-mono font-bold text-gray-800">
                    {orderData?.orderId || orderId}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Amount Paid:</span>
                  <span className="font-bold text-[#C41E3A] text-xl">
                    ₹{orderData?.amount?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Status:</span>
                  <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                    {orderData?.status || 'Confirmed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            {orderData?.trackingUrl && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Truck className="w-6 h-6 text-[#C41E3A]" />
                  Shipping Information
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <p className="text-gray-700 mb-4">
                    Your order is being prepared for shipment. You can track your order using the
                    link below:
                  </p>
                  <a
                    href={orderData.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Track Your Order
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Customer Information */}
            {orderData?.customer && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Delivery Address</h2>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="font-semibold text-gray-800 mb-2">{orderData.customer.name}</p>
                  <p className="text-gray-600">{orderData.customer.email}</p>
                  <p className="text-gray-600 mb-3">{orderData.customer.phone}</p>
                  <div className="text-gray-700">
                    <p>{orderData.customer.address.line1}</p>
                    {orderData.customer.address.line2 && <p>{orderData.customer.address.line2}</p>}
                    <p>
                      {orderData.customer.address.city}, {orderData.customer.address.state} -{' '}
                      {orderData.customer.address.pincode}
                    </p>
                    <p>{orderData.customer.address.country}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            {orderData?.items && orderData.items.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Items</h2>
                <div className="space-y-3">
                  {orderData.items.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-[#C41E3A] to-[#A3182F] rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">What's Next?</h3>
              <ul className="space-y-2 text-white/90">
                <li>✓ You'll receive an order confirmation email shortly</li>
                <li>✓ We'll notify you when your order is shipped</li>
                <li>✓ Track your order anytime using the tracking link</li>
                <li>✓ Estimated delivery: 3-5 business days</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Link
                href="/"
                className="flex-1 text-center bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </Link>
              {orderData?.trackingUrl && (
                <a
                  href={orderData.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-center bg-[#C41E3A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A3182F] transition-colors"
                >
                  Track Order
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="text-center text-gray-600">
          <p>
            Need help? Contact us at{' '}
            <a href="mailto:support@drinkbrewy.com" className="text-[#C41E3A] font-semibold">
              support@drinkbrewy.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
