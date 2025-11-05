// This file is deprecated - now using Shopify products
// See src/lib/shopify-products.ts for the new implementation

export interface Product {
  id: string;
  name: string;
  flavor: string;
  price: number;
  image: string;
  description: string;
  stock: number;
}

// Legacy products array - kept for backward compatibility
export const products: Product[] = [];
