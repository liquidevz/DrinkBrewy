import { notFound } from 'next/navigation';
import { getBackendProduct } from '@/lib/backend-products';
import ProductView from './ProductView';

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getBackendProduct(params.handle);

  if (!product) {
    notFound();
  }

  return <ProductView product={product} />;
}

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const product = await getBackendProduct(params.handle);

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