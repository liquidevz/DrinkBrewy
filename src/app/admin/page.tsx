'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/products" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-2">Products</h2>
            <p className="text-gray-600">Manage product inventory</p>
          </Link>
          
          <Link href="/admin/orders" className="bg-white p-8 rounded-lg shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold mb-2">Orders</h2>
            <p className="text-gray-600">View and manage orders</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
