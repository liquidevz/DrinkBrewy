'use client';

import { useState, useEffect } from 'react';

export default function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-admin-password': localStorage.getItem('adminPassword') || ''
  });

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:5000/api/admin/orders', {
      headers: getHeaders()
    });
    const data = await res.json();
    setOrders(data);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch(`http://localhost:5000/api/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Order Management</h1>
        
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">Order #{order.orderId}</h3>
                  <p className="text-gray-600">{order.customer.name} - {order.customer.email}</p>
                  <p className="text-gray-600">{order.customer.phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">₹{order.total}</p>
                  <select 
                    value={order.status}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="mt-2 p-2 border rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-bold mb-2">Items:</h4>
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              
              {order.awb && (
                <div className="mt-4 p-3 bg-blue-50 rounded">
                  <p className="text-sm"><strong>AWB:</strong> {order.awb}</p>
                  <p className="text-sm"><strong>Shipment ID:</strong> {order.shipmentId}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
