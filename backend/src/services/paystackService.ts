import axios from 'axios';
import { config } from '../config';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const paystackApi = axios.create({
  baseURL: PAYSTACK_BASE_URL,
  headers: {
    Authorization: `Bearer ${config.paystack.secretKey}`,
    'Content-Type': 'application/json',
  },
});

interface InitializePaymentData {
  email: string;
  amount: number; // in kobo (pesewas for GHS)
  reference: string;
  callback_url: string;
  currency?: string;
  metadata?: Record<string, unknown>;
}

export const initializePayment = async (data: InitializePaymentData) => {
  const response = await paystackApi.post('/transaction/initialize', {
    email: data.email,
    amount: Math.round(data.amount * 100), // Convert to pesewas
    reference: data.reference,
    callback_url: data.callback_url,
    currency: data.currency || 'GHS',
    metadata: data.metadata || {},
  });

  return response.data;
};

export const verifyPayment = async (reference: string) => {
  const response = await paystackApi.get(`/transaction/verify/${reference}`);
  return response.data;
};
