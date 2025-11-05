const API_URL = 'http://localhost:5000/api';

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'x-admin-password': localStorage.getItem('adminPassword') || ''
});

export const adminApi = {
  getOrders: () => fetch(`${API_URL}/admin/orders`, { headers: getHeaders() }).then(r => r.json()),
  updateOrderStatus: (id: string, status: string) => 
    fetch(`${API_URL}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status })
    }).then(r => r.json()),
  updateProduct: (id: string, data: any) =>
    fetch(`${API_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(r => r.json()),
  deleteProduct: (id: string) =>
    fetch(`${API_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(r => r.json())
};
