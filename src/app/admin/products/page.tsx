'use client';

import { useState, useEffect } from 'react';

export default function ProductsAdmin() {
  const [products, setProducts] = useState<any[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<any>({ id: '', name: '', price: 0, description: '', images: [] });

  useEffect(() => {
    fetchProducts();
  }, []);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-admin-password': localStorage.getItem('adminPassword') || ''
  });

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editing 
      ? `http://localhost:5000/api/admin/products/${editing}`
      : 'http://localhost:5000/api/products';
    
    await fetch(url, {
      method: editing ? 'PUT' : 'POST',
      headers: getHeaders(),
      body: JSON.stringify(form)
    });
    
    setForm({ id: '', name: '', price: 0, description: '', images: [] });
    setEditing(null);
    fetchProducts();
  };

  const handleEdit = (product: any) => {
    setForm(product);
    setEditing(product.id);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product?')) {
      await fetch(`http://localhost:5000/api/admin/products/${id}`, { 
        method: 'DELETE',
        headers: getHeaders()
      });
      fetchProducts();
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Product Management</h1>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">{editing ? 'Edit' : 'Add'} Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product ID"
              value={form.id}
              onChange={(e) => setForm({...form, id: e.target.value})}
              className="w-full p-2 border rounded"
              required
              disabled={!!editing}
            />
            <input
              type="text"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({...form, price: parseFloat(e.target.value)})}
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({...form, description: e.target.value})}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Image URLs (comma separated)"
              value={form.images.join(',')}
              onChange={(e) => setForm({...form, images: e.target.value.split(',')})}
              className="w-full p-2 border rounded"
            />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                {editing ? 'Update' : 'Create'}
              </button>
              {editing && (
                <button type="button" onClick={() => { setEditing(null); setForm({ id: '', name: '', price: 0, description: '', images: [] }); }} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="px-6 py-4">{product.id}</td>
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(product)} className="text-blue-600 hover:underline mr-4">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
