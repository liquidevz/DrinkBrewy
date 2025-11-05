'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const password = localStorage.getItem('adminPassword');
    if (!password && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (password) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [pathname, router]);

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    router.push('/admin/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex space-x-8">
              <Link href="/admin" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/admin' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                Dashboard
              </Link>
              <Link href="/admin/products" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/admin/products' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                Products
              </Link>
              <Link href="/admin/orders" className={`px-3 py-2 rounded-md text-sm font-medium ${pathname === '/admin/orders' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}>
                Orders
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
                View Store
              </Link>
              <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
