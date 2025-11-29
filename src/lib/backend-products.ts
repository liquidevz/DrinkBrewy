// Use Next.js API routes as proxy to avoid CORS issues
const API_BASE = '/api/backend';

export interface FrontendProduct {
  id: string;
  name: string;
  flavor: string;
  price: number;
  description: string;
  handle: string;
  availableForSale: boolean;
  variants: Array<{
    id: string;
    title: string;
    price: number;
    availableForSale: boolean;
  }>;
}

export async function getBackendProducts(): Promise<FrontendProduct[]> {
  try {
    const response = await fetch(`${API_BASE}/products`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch products from backend:', response.statusText);
      return [];
    }
    
    const products = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching backend products:', error);
    return [];
  }
}

export async function getBackendProduct(handle: string): Promise<FrontendProduct | null> {
  try {
    const response = await fetch(`${API_BASE}/products/${handle}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Failed to fetch product from backend:', response.statusText);
      return null;
    }
    
    const product = await response.json();
    return product;
  } catch (error) {
    console.error('Error fetching backend product:', error);
    return null;
  }
}
