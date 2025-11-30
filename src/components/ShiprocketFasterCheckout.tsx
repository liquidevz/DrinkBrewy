'use client';

import { useState, useEffect } from 'react';
import { Loader2, Package, Truck, CreditCard, MapPin } from 'lucide-react';

interface CheckoutItem {
  productId: string;
  variantId: string;
  name: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
}

interface ShiprocketFasterCheckoutProps {
  items: CheckoutItem[];
  onSuccess?: (orderId: string, trackingUrl?: string) => void;
  onError?: (error: string) => void;
  pickupPincode?: string;
}

export default function ShiprocketFasterCheckout({
  items,
  onSuccess,
  onError,
  pickupPincode = '400001',
}: ShiprocketFasterCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [checkingServiceability, setCheckingServiceability] = useState(false);
  const [serviceable, setServiceable] = useState<boolean | null>(null);
  const [estimatedDays, setEstimatedDays] = useState<number | null>(null);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
  });

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check serviceability when pincode changes
  useEffect(() => {
    if (customer.address.pincode.length === 6) {
      checkServiceability();
    } else {
      setServiceable(null);
    }
  }, [customer.address.pincode]);

  const checkServiceability = async () => {
    setCheckingServiceability(true);
    try {
      const response = await fetch('/api/faster-checkout/check-serviceability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickupPincode,
          deliveryPincode: customer.address.pincode,
          weight: items.length * 0.5, // Assuming 0.5kg per item
        }),
      });

      const data = await response.json();
      setServiceable(data.serviceable);
      setEstimatedDays(data.estimatedDeliveryDays);
    } catch (error) {
      console.error('Error checking serviceability:', error);
      setServiceable(null);
    } finally {
      setCheckingServiceability(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!serviceable) {
      onError?.('Delivery not available to this pincode');
      return;
    }

    setLoading(true);

    try {
      // Create Faster Checkout session
      const response = await fetch('/api/faster-checkout/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer,
          pickupPincode,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Shiprocket Faster Checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      onError?.(error.message || 'Failed to initiate checkout');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C41E3A] to-[#A3182F] p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">Checkout</h2>
          <p className="text-white/90">Complete your order with secure payment and fast delivery</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Order Summary */}
          <div className="mb-8 bg-cream rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#C41E3A]" />
              <h3 className="text-xl font-bold">Order Summary</h3>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t border-gray-300 pt-3 mt-3">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Amount</span>
                  <span className="text-[#C41E3A]">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#C41E3A]" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#C41E3A]" />
                Delivery Address
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={customer.address.line1}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        address: { ...customer.address, line1: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    placeholder="House/Flat No., Building Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={customer.address.line2}
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        address: { ...customer.address, line2: e.target.value },
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                    placeholder="Street, Area, Landmark"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.address.city}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          address: { ...customer.address, city: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={customer.address.state}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          address: { ...customer.address, state: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      pattern="[0-9]{6}"
                      value={customer.address.pincode}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          address: { ...customer.address, pincode: e.target.value },
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                      placeholder="400001"
                    />
                  </div>
                </div>

                {/* Serviceability Status */}
                {customer.address.pincode.length === 6 && (
                  <div className="mt-2">
                    {checkingServiceability ? (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">Checking delivery availability...</span>
                      </div>
                    ) : serviceable === true ? (
                      <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                        <Truck className="w-5 h-5" />
                        <span className="text-sm font-semibold">
                          Delivery available
                          {estimatedDays && ` • Estimated ${estimatedDays} days`}
                        </span>
                      </div>
                    ) : serviceable === false ? (
                      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
                        <Truck className="w-5 h-5" />
                        <span className="text-sm font-semibold">
                          Delivery not available to this pincode
                        </span>
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading || !serviceable || checkingServiceability}
                className="w-full bg-gradient-to-r from-[#C41E3A] to-[#A3182F] text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment & Delivery
                  </>
                )}
              </button>
              <p className="text-center text-sm text-gray-600 mt-4">
                Powered by Shiprocket Faster Checkout • Secure Payment & Fast Delivery
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
