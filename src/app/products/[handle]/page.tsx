import { notFound } from 'next/navigation';
import { getShopifyProduct } from '@/lib/shopify-products';
import ProductView from './ProductView';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getShopifyProduct(params.handle);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const product = await getShopifyProduct(params.handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}