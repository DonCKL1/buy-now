import axios from 'axios';

// In development, Vite proxy handles /api → backend
// In production, set VITE_API_URL to the backend URL (e.g. https://your-backend.onrender.com)
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ──── Public Endpoints ────

export interface AppConfig {
  tshirt: {
    price: number;
    name: string;
    className: string;
    classYear: string;
  };
  paystackPublicKey: string;
  paystackFeePercentage: number;
}

export const getConfig = async (): Promise<AppConfig> => {
  const { data } = await api.get('/config');
  return data;
};

export interface CreateOrderPayload {
  name: string;
  index_number: string;
  phone: string;
  size: string;
  quantity: number;
}

export interface CreateOrderResponse {
  message: string;
  order: {
    order_reference: string;
    amount: number;
  };
}

export const createOrder = async (payload: CreateOrderPayload): Promise<CreateOrderResponse> => {
  const { data } = await api.post('/orders', payload);
  return data;
};

export interface InitPaymentPayload {
  order_reference: string;
  email?: string;
  name?: string;
  index_number?: string;
  phone?: string;
  size?: string;
  quantity?: number;
}

export interface InitPaymentResponse {
  message: string;
  authorization_url: string;
  reference: string;
}

export const initializePayment = async (payload: InitPaymentPayload): Promise<InitPaymentResponse> => {
  const { data } = await api.post('/payment/initialize', payload);
  return data;
};

export interface VerifyPaymentResponse {
  status: 'success' | 'failed';
  message: string;
  order?: {
    order_reference: string;
    name?: string;
    amount?: number;
    size?: string;
    quantity?: number;
    payment_status: string;
  };
}

export const verifyPayment = async (reference: string): Promise<VerifyPaymentResponse> => {
  const { data } = await api.get(`/payment/verify/${reference}`);
  return data;
};

// ──── Admin Endpoints ────

const getAdminHeaders = () => {
  const creds = localStorage.getItem('admin_creds');
  if (!creds) return {};
  return {
    Authorization: `Basic ${creds}`,
  };
};

export const adminLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    const creds = btoa(`${username}:${password}`);
    await api.post('/admin/login', {}, {
      headers: { Authorization: `Basic ${creds}` },
    });
    localStorage.setItem('admin_creds', creds);
    return true;
  } catch {
    return false;
  }
};

export const adminLogout = () => {
  localStorage.removeItem('admin_creds');
};

export interface Order {
  id: number;
  order_reference: string;
  name: string;
  index_number: string;
  phone: string;
  size: string;
  quantity: number;
  amount: number;
  payment_status: 'PENDING' | 'PAID' | 'FAILED';
  delivery_status: 'PENDING' | 'DELIVERED';
  paystack_reference: string | null;
  created_at: string;
  updated_at: string;
}

export const getOrders = async (search?: string, status?: string, deliveryStatus?: string): Promise<Order[]> => {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (status) params.status = status;
  if (deliveryStatus) params.delivery_status = deliveryStatus;

  const { data } = await api.get('/admin/orders', {
    headers: getAdminHeaders(),
    params,
  });
  return data.orders;
};

export const updateDeliveryStatus = async (id: number, delivery_status: 'PENDING' | 'DELIVERED'): Promise<boolean> => {
  const { data } = await api.patch(`/admin/orders/${id}/delivery`, { delivery_status }, {
    headers: getAdminHeaders(),
  });
  return data.message === 'Delivery status updated successfully';
};

export const deleteOrder = async (id: number): Promise<boolean> => {
  const { data } = await api.delete(`/admin/orders/${id}`, {
    headers: getAdminHeaders(),
  });
  return data.message === 'Order deleted successfully';
};

export interface Stats {
  totalOrders: number;
  paidOrders: number;
  deliveredOrders: number;
  pendingDeliveries: number;
  totalSales: number;
}

export const getStats = async (): Promise<Stats> => {
  const { data } = await api.get('/admin/stats', {
    headers: getAdminHeaders(),
  });
  return data.stats;
};

export const exportOrdersCSV = async (status?: string, deliveryStatus?: string): Promise<void> => {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  if (deliveryStatus) params.delivery_status = deliveryStatus;

  const { data } = await api.get('/admin/orders/export', {
    headers: getAdminHeaders(),
    params,
    responseType: 'blob',
  });

  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const sendOrderMessage = async (id: number, customMessage: string): Promise<boolean> => {
  try {
    const { data } = await api.post(`/admin/orders/${id}/message`, { customMessage }, {
      headers: getAdminHeaders(),
    });
    return data.message === 'Message sent successfully';
  } catch {
    return false;
  }
};

