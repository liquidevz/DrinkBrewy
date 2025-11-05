export async function fetchProducts() {
  const res = await fetch('/api/products');
  return res.json();
}

export async function fetchProduct(id: string) {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}

export async function calculateCart(items: { productId: string; quantity: number }[]) {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });
  return res.json();
}

export async function createOrder(data: {
  items: { productId: string; quantity: number }[];
  customer: { name: string; email: string; address: string };
}) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}
