import { SHOPIFY_GRAPHQL_API_ENDPOINT } from '../../lib/constants';
import { ensureStartsWith } from '../../lib/utils';
import { isShopifyError } from '../../lib/type-guards';
import { 
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation
} from '../../lib/shopify/mutations/cart';
import { getCartQuery } from '../../lib/shopify/queries/cart';
import { getProductsQuery, getProductQuery } from '../../lib/shopify/queries/product';
import {
  Cart,
  Product,
  ShopifyAddToCartOperation,
  ShopifyCart,
  ShopifyCartOperation,
  ShopifyCreateCartOperation,
  ShopifyProductOperation,
  ShopifyProductsOperation,
  ShopifyRemoveFromCartOperation,
  ShopifyUpdateCartOperation,
  Connection
} from '../../lib/shopify/types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
  ? ensureStartsWith(process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN, 'https://')
  : '';
const endpoint = `${domain}${SHOPIFY_GRAPHQL_API_ENDPOINT}`;
const key = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

let cartId: string | null = null;

// Get cart ID from localStorage
const getCartId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('shopify-cart-id');
  }
  return cartId;
};

// Set cart ID in localStorage
const setCartId = (id: string) => {
  cartId = id;
  if (typeof window !== 'undefined') {
    localStorage.setItem('shopify-cart-id', id);
  }
};

type ExtractVariables<T> = T extends { variables: object } ? T['variables'] : never;

async function shopifyFetch<T>({
  query,
  variables
}: {
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }> {
  try {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': key
      },
      body: JSON.stringify({
        query,
        ...(variables && { variables })
      })
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return { status: result.status, body };
  } catch (e) {
    if (isShopifyError(e)) {
      throw {
        cause: e.cause?.toString() || 'unknown',
        status: e.status || 500,
        message: e.message,
        query
      };
    }
    throw { error: e, query };
  }
}

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge?.node);
};

const reshapeCart = (cart: ShopifyCart): Cart => {
  if (!cart.cost?.totalTaxAmount) {
    cart.cost.totalTaxAmount = {
      amount: '0.0',
      currencyCode: cart.cost.totalAmount.currencyCode
    };
  }

  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines)
  };
};

const reshapeProduct = (product: any) => {
  if (!product) return undefined;
  
  const { images, variants, ...rest } = product;
  
  return {
    ...rest,
    images: removeEdgesAndNodes(images),
    variants: removeEdgesAndNodes(variants)
  };
};

export async function createCart(): Promise<Cart> {
  const res = await shopifyFetch<ShopifyCreateCartOperation>({
    query: createCartMutation
  });

  const cart = reshapeCart(res.body.data.cartCreate.cart);
  if (cart.id) {
    setCartId(cart.id);
  }
  return cart;
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  let currentCartId = getCartId();
  
  if (!currentCartId) {
    const newCart = await createCart();
    currentCartId = newCart.id || null;
  }

  if (!currentCartId) throw new Error('Failed to create cart');

  const res = await shopifyFetch<ShopifyAddToCartOperation>({
    query: addToCartMutation,
    variables: { cartId: currentCartId, lines }
  });
  
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const currentCartId = getCartId();
  if (!currentCartId) throw new Error('No cart found');

  const res = await shopifyFetch<ShopifyRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: { cartId: currentCartId, lineIds }
  });

  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const currentCartId = getCartId();
  if (!currentCartId) throw new Error('No cart found');

  const res = await shopifyFetch<ShopifyUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: { cartId: currentCartId, lines }
  });

  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function getCart(): Promise<Cart | undefined> {
  const currentCartId = getCartId();
  if (!currentCartId) return undefined;

  try {
    const res = await shopifyFetch<ShopifyCartOperation>({
      query: getCartQuery,
      variables: { cartId: currentCartId }
    });

    if (!res.body.data.cart) return undefined;
    return reshapeCart(res.body.data.cart);
  } catch {
    return undefined;
  }
}

export async function getProducts(): Promise<Product[]> {
  const res = await shopifyFetch<ShopifyProductsOperation>({
    query: getProductsQuery,
    variables: {}
  });

  return removeEdgesAndNodes(res.body.data.products)
    .map(reshapeProduct)
    .filter(Boolean);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const res = await shopifyFetch<ShopifyProductOperation>({
    query: getProductQuery,
    variables: { handle }
  });

  return reshapeProduct(res.body.data.product);
}