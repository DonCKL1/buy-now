import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import * as paystackService from '../services/paystackService';
import { sendPurchaseSuccessSMS } from '../services/smsService';
import { config } from '../config';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, index_number, phone, size, quantity } = req.body;

    const prep = await orderService.prepareOrder({
      name,
      index_number,
      phone,
      size,
      quantity: parseInt(quantity, 10),
    });

    res.status(201).json({
      message: 'Order reference generated',
      order: {
        order_reference: prep.order_reference,
        amount: prep.amount,
      },
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to prepare order' });
  }
};

export const initializePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { order_reference, email, name, index_number, phone, size, quantity } = req.body;

    if (!order_reference) {
      res.status(400).json({ error: 'Order reference is required' });
      return;
    }

    const qty = parseInt(quantity || 1, 10);
    const amount = orderService.calculateOrderAmount(qty);
    const paystackReference = `PAY-${order_reference}-${Date.now()}`;
    const callbackUrl = `${config.frontendUrl}/payment/verify?reference=${paystackReference}`;
    const customerEmail = email || `${phone ? phone.trim() : 'student'}@order.ckltech.com`;

    const response = await paystackService.initializePayment({
      email: customerEmail,
      amount,
      reference: paystackReference,
      callback_url: callbackUrl,
      currency: 'GHS',
      metadata: {
        order_reference,
        name: name ? name.trim() : '',
        index_number: index_number ? index_number.trim() : '',
        phone: phone ? phone.trim() : '',
        size,
        quantity: qty,
        amount,
      },
    });

    res.json({
      message: 'Payment initialized',
      authorization_url: response.data.authorization_url,
      reference: paystackReference,
    });
  } catch (error: any) {
    console.error('Initialize payment error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const reference = req.params.reference as string;

    if (!reference) {
      res.status(400).json({ error: 'Payment reference is required' });
      return;
    }

    // Check if order already saved by paystack reference
    const existingOrderByPaystack = await orderService.getOrderByPaystackReference(reference);
    if (existingOrderByPaystack && existingOrderByPaystack.payment_status === 'PAID') {
      res.json({
        status: 'success',
        message: 'Payment already verified',
        order: {
          order_reference: existingOrderByPaystack.order_reference,
          name: existingOrderByPaystack.name,
          amount: existingOrderByPaystack.amount,
          size: existingOrderByPaystack.size,
          quantity: existingOrderByPaystack.quantity,
          payment_status: 'PAID',
        },
      });
      return;
    }

    // Verify with Paystack API
    const verification = await paystackService.verifyPayment(reference);

    if (verification.data.status === 'success') {
      const meta = verification.data.metadata || {};
      const orderRef = meta.order_reference || `FTS-${Date.now()}`;
      const name = meta.name || 'Student';
      const indexNum = meta.index_number || 'N/A';
      const phone = meta.phone || 'N/A';
      const size = meta.size || 'L';
      const qty = parseInt(meta.quantity || 1, 10);
      const paidAmount = Number((verification.data.amount / 100).toFixed(2));

      // Save order to MySQL database as PAID
      const savedOrder = await orderService.savePaidOrder(
        orderRef,
        reference,
        {
          name,
          index_number: indexNum,
          phone,
          size,
          quantity: qty,
        },
        paidAmount
      );

      // Trigger SMS confirmation via Arkesel
      sendPurchaseSuccessSMS({
        to: phone,
        name,
        orderReference: savedOrder.order_reference,
      }).catch((smsErr) => {
        console.error('Non-blocking SMS error:', smsErr);
      });

      res.json({
        status: 'success',
        message: 'Payment verified and order recorded',
        order: {
          order_reference: savedOrder.order_reference,
          name,
          amount: paidAmount,
          size,
          quantity: qty,
          payment_status: 'PAID',
        },
      });
    } else {
      // Payment was cancelled or failed - DO NOT save to database
      res.json({
        status: 'failed',
        message: 'Payment was cancelled or unsuccessful',
      });
    }
  } catch (error: any) {
    console.error('Verify payment error:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

export const getConfig = async (_req: Request, res: Response): Promise<void> => {
  res.json({
    tshirt: {
      price: config.tshirt.price,
      name: config.tshirt.name,
      className: config.tshirt.className,
      classYear: config.tshirt.classYear,
    },
    paystackPublicKey: config.paystack.publicKey,
    paystackFeePercentage: config.paystack.feePercentage,
  });
};
