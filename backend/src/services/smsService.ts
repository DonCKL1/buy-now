import axios from 'axios';
import { config } from '../config';

export interface SendSmsParams {
  to: string;
  name: string;
  orderReference: string;
}

export const formatGhanaPhoneNumber = (phone: string): string => {
  let cleaned = phone.replace(/\D/g, ''); // strip non-numeric
  if (cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '233' + cleaned.substring(1);
  }
  return cleaned;
};

export const sendPurchaseSuccessSMS = async ({ to, name, orderReference }: SendSmsParams): Promise<boolean> => {
  try {
    const formattedPhone = formatGhanaPhoneNumber(to);
    const senderId = config.arkesel.senderId || 'CKLTECH';
    const apiKey = config.arkesel.apiKey;

    if (!apiKey) {
      console.warn('Arkesel SMS API Key is missing. Skipping SMS dispatch.');
      return false;
    }

    const message = `Dear ${name}, your order #${orderReference} is confirmed. Our team will contact you shortly for delivery within 48-72 hours. Thank you for your purchase! - ${config.tshirt.className}`;

    const response = await axios.get('https://sms.arkesel.com/sms/api', {
      params: {
        action: 'send-sms',
        api_key: apiKey,
        to: formattedPhone,
        from: senderId,
        sms: message,
      },
      timeout: 10000,
    });

    console.log('Arkesel SMS API Response:', response.data);
    return true;
  } catch (error: any) {
    console.error('Failed to send purchase confirmation SMS via Arkesel:', error?.response?.data || error.message);
    return false;
  }
};

export const sendDeliverySMS = async ({ to, name, orderReference }: SendSmsParams): Promise<boolean> => {
  try {
    const formattedPhone = formatGhanaPhoneNumber(to);
    const senderId = config.arkesel.senderId || 'CKLTECH';
    const apiKey = config.arkesel.apiKey;

    if (!apiKey) {
      console.warn('Arkesel SMS API Key is missing. Skipping SMS dispatch.');
      return false;
    }

    const message = `Dear ${name}, your order #${orderReference} has been successfully delivered. Please be reminded that this t-shirt is mandatory for our final examination paper and the class photoshoot scheduled for Thursday, August 20th. Thank you! - ${config.tshirt.className}`;

    const response = await axios.get('https://sms.arkesel.com/sms/api', {
      params: {
        action: 'send-sms',
        api_key: apiKey,
        to: formattedPhone,
        from: senderId,
        sms: message,
      },
      timeout: 10000,
    });

    console.log('Arkesel SMS API Response (Delivery):', response.data);
    return true;
  } catch (error: any) {
    console.error('Failed to send delivery SMS via Arkesel:', error?.response?.data || error.message);
    return false;
  }
};
