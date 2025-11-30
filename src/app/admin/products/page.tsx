'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Package, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  flavor: string;
  price: number;
  description: string;
  handle: string;
  images: string[];
  stock: number;
  availableForSale: boolean;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
    sku?: string;
  }>;
  dimensions?: {
    length: number;
    breadth: number;
    height: number;
    weight: number;
  };
}

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Product>>({
    id: '',
    name: '',
    flavor: '',
    price: 0,
    description: '',
    handle: '',
    images: [],
    stock: 0,
    availableForSale: true,
    variants: [],
    dimensions: {
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const getHeaders = () => ({
    'Content-Type': 'application/json',
    'x-admin-password': localStorage.getItem('adminPassword') || '',
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/products');
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = editing
        ? `http://localhost:3000/api/products/${editing}`
        : 'http://localhost:3000/api/products';

      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        headers: getHeaders(),
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save product');
      }

      resetForm();
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setForm(product);
    setEditing(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      id: '',
      name: '',
      flavor: '',
      price: 0,
      description: '',
      handle: '',
      images: [],
      stock: 0,
      availableForSale: true,
      variants: [],
      dimensions: {
        length: 10,
        breadth: 10,
        height: 10,
        weight: 0.5,
      },
    });
    setEditing(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#C41E3A] mb-2">Product Management</h1>
            <p className="text-gray-600">Manage your DrinkBrewy product catalog</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
            <Package className="w-5 h-5 text-[#C41E3A]" />
            <span className="font-semibold">{products.length} Products</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Product Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Plus className="w-6 h-6 text-[#C41E3A]" />
            <h2 className="text-2xl font-bold text-gray-800">
              {editing ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product ID *
                </label>
                <input
                  type="text"
                  placeholder="e.g., BREWY001"
                  value={form.id}
                  onChange={(e) => setForm({ ...form, id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                  required
                  disabled={!!editing}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., DrinkBrewy Cola"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Flavor *
                </label>
                <select
                  value={form.flavor}
                  onChange={(e) => setForm({ ...form, flavor: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                  required
                >
                  <option value="">Select Flavor</option>
                  <option value="blackCherry">Black Cherry</option>
                  <option value="grape">Grape</option>
                  <option value="lemonLime">Lemon Lime</option>
                  <option value="strawberryLemonade">Strawberry Lemonade</option>
                  <option value="watermelon">Watermelon</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Handle (URL slug) *
                </label>
                <input
                  type="text"
                  placeholder="e.g., black-cherry"
                  value={form.handle}
                  onChange={(e) => setForm({ ...form, handle: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="99.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                placeholder="Product description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image URLs (comma separated)
              </label>
              <input
                type="text"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                value={form.images?.join(', ')}
                onChange={(e) =>
                  setForm({ ...form, images: e.target.value.split(',').map((s) => s.trim()) })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Length (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.dimensions?.length}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dimensions: { ...form.dimensions!, length: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Breadth (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.dimensions?.breadth}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dimensions: { ...form.dimensions!, breadth: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={form.dimensions?.height}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dimensions: { ...form.dimensions!, height: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.dimensions?.weight}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      dimensions: { ...form.dimensions!, weight: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C41E3A] focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="availableForSale"
                checked={form.availableForSale}
                onChange={(e) => setForm({ ...form, availableForSale: e.target.checked })}
                className="w-5 h-5 text-[#C41E3A] rounded focus:ring-[#C41E3A]"
              />
              <label htmlFor="availableForSale" className="text-sm font-semibold text-gray-700">
                Available for Sale
              </label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#C41E3A] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#A3182F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#C41E3A] to-[#A3182F] text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">ID</th>
                  <th className="px-6 py-4 text-left font-semibold">Name</th>
                  <th className="px-6 py-4 text-left font-semibold">Flavor</th>
                  <th className="px-6 py-4 text-left font-semibold">Price</th>
                  <th className="px-6 py-4 text-left font-semibold">Stock</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No products found. Create your first product above!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">{product.id}</td>
                      <td className="px-6 py-4 font-semibold">{product.name}</td>
                      <td className="px-6 py-4 capitalize">{product.flavor}</td>
                      <td className="px-6 py-4 font-semibold">₹{product.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 10
                              ? 'bg-green-100 text-green-700'
                              : product.stock > 0
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${product.availableForSale
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {product.availableForSale ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
