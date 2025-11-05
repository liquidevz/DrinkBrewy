import { getProducts, getProduct } from '@/lib/shopify-client';
import { Product } from '../../lib/shopify/types';

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

const FLAVOR_MAP: Record<string, string> = {
  'black-cherry': 'blackCherry',
  'grape': 'grape', 
  'lemon-lime': 'lemonLime',
  'strawberry-lemonade': 'strawberryLemonade',
  'watermelon': 'watermelon'
};

export async function getShopifyProducts(): Promise<FrontendProduct[]> {
  try {
    const products = await getProducts();
    
    return products.map(transformProduct).filter(Boolean) as FrontendProduct[];
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    return [];
  }
}

export async function getShopifyProduct(handle: string): Promise<FrontendProduct | null> {
  try {
    const product = await getProduct(handle);
    if (!product) return null;
    
    return transformProduct(product);
  } catch (error) {
    console.error('Error fetching Shopify product:', error);
    return null;
  }
}

function transformProduct(product: Product): FrontendProduct | null {
  if (!product.availableForSale || product.variants.length === 0) {
    return null;
  }

  const defaultVariant = product.variants[0];
  const flavorKey = FLAVOR_MAP[product.handle] || 'blackCherry';

  return {
    id: product.id,
    name: product.title,
    flavor: flavorKey,
    price: parseFloat(defaultVariant.price.amount),
    description: product.description,
    handle: product.handle,
    availableForSale: product.availableForSale,
    variants: product.variants.map(variant => ({
      id: variant.id,
      title: variant.title,
      price: parseFloat(variant.price.amount),
      availableForSale: variant.availableForSale
    }))
  };
}