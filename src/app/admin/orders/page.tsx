'use client';

import { useState, useEffect } from 'react';
import { Package, Truck, CheckCircle, XCircle, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface Order {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed' | 'shipped' | 'delivered';
  customer: {
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
  };
  items: Array<{
    productId: string;
    variantId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  shiprocketOrderId?: string;
  shiprocketShipmentId?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [processingShipment, setProcessingShipment] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-admin-password': localStorage.getItem('adminPassword') || '',
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: getHeaders(),
      });
      const data = await res.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createShipment = async (orderId: string) => {
    try {
      setProcessingShipment(orderId);
      const response = await fetch('http://localhost:5000/api/shipment/create', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          orderId,
          pickupLocation: 'Primary',
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create shipment');
      }

      alert('Shipment created successfully!');
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to create shipment');
    } finally {
      setProcessingShipment(null);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-yellow-100 text-yellow-700';
      case 'paid':
        return 'bg-blue-100 text-blue-700';
      case 'shipped':
        return 'bg-purple-100 text-purple-700';
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created':
        return <Clock className="w-4 h-4" />;
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <Package className="w-4 h-4" />;
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#C41E3A] mb-2">Order Management</h1>
            <p className="text-gray-600">Manage orders, payments, and shipments</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <RefreshCw className={`w-5 h-5 text-[#C41E3A] ${loading ? 'animate-spin' : ''}`} />
              <span className="font-semibold">Refresh</span>
            </button>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Package className="w-5 h-5 text-[#C41E3A]" />
              <span className="font-semibold">{orders.length} Orders</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#C41E3A] to-[#A3182F] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Order ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Customer</th>
                  <th className="px-6 py-4 text-left font-semibold">Amount</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Date</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.orderId} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-mono text-sm font-semibold">{order.orderId}</p>
                          {order.razorpayPaymentId && (
                            <p className="text-xs text-gray-500 mt-1">
                              Payment: {order.razorpayPaymentId.substring(0, 20)}...
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{order.customer.name}</p>
                          <p className="text-sm text-gray-600">{order.customer.email}</p>
                          <p className="text-sm text-gray-600">{order.customer.phone}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-[#C41E3A]">
                          ₹{order.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{order.currency}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="text-blue-600 hover:underline text-sm font-semibold"
                          >
                            View Details
                          </button>
                          {order.status === 'paid' && !order.shiprocketOrderId && (
                            <button
                              onClick={() => createShipment(order.orderId)}
                              disabled={processingShipment === order.orderId}
                              className="text-green-600 hover:underline text-sm font-semibold disabled:opacity-50"
                            >
                              {processingShipment === order.orderId
                                ? 'Creating...'
                                : 'Create Shipment'}
                            </button>
                          )}
                          {order.trackingUrl && (
                            <a
                              href={order.trackingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-purple-600 hover:underline text-sm font-semibold"
                            >
                              Track
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-[#C41E3A] to-[#A3182F] p-6 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-white hover:bg-white/20 rounded-lg p-2"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Info */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Order Information</h3>
                  <div className="bg-cream rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono font-semibold">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-[#C41E3A]">
                        ₹{selectedOrder.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedOrder.status)}`}
                      >
                        {selectedOrder.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold mb-2">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.customer.email}</p>
                    <p className="text-sm text-gray-600 mb-3">{selectedOrder.customer.phone}</p>
                    <div className="text-sm text-gray-700">
                      <p>{selectedOrder.customer.address.line1}</p>
                      {selectedOrder.customer.address.line2 && (
                        <p>{selectedOrder.customer.address.line2}</p>
                      )}
                      <p>
                        {selectedOrder.customer.address.city},{' '}
                        {selectedOrder.customer.address.state} -{' '}
                        {selectedOrder.customer.address.pincode}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 rounded-lg p-4"
                      >
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipment Info */}
                {selectedOrder.shiprocketOrderId && (
                  <div>
                    <h3 className="text-lg font-bold mb-3">Shipment Information</h3>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shiprocket Order ID:</span>
                        <span className="font-mono">{selectedOrder.shiprocketOrderId}</span>
                      </div>
                      {selectedOrder.shiprocketShipmentId && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipment ID:</span>
                          <span className="font-mono">{selectedOrder.shiprocketShipmentId}</span>
                        </div>
                      )}
                      {selectedOrder.trackingUrl && (
                        <a
                          href={selectedOrder.trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:underline font-semibold"
                        >
                          Track Shipment
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
