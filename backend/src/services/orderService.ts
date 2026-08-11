import pool from '../db';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export interface OrderData {
  name: string;
  index_number: string;
  phone: string;
  size: string;
  quantity: number;
}

export interface Order extends RowDataPacket {
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
  created_at: Date;
  updated_at: Date;
}

export const generateOrderReference = (): string => {
  const year = new Date().getFullYear();
  const uniquePart = uuidv4().split('-')[0].toUpperCase();
  return `FTS-${year}-${uniquePart}`;
};

export const calculateOrderAmount = (quantity: number, sizePayload?: string): number => {
  let baseAmount = 0;
  try {
    if (sizePayload && sizePayload.startsWith('{')) {
      const items = JSON.parse(sizePayload);
      if (items.classicTshirt?.qty) baseAmount += config.tshirt.price * items.classicTshirt.qty;
      if (items.limitedTshirt?.qty) baseAmount += 80 * items.limitedTshirt.qty;
      if (items.mug?.qty) baseAmount += 60 * items.mug.qty;
      if (items.bag?.qty) baseAmount += 80 * items.bag.qty;
    } else {
      baseAmount = config.tshirt.price * quantity;
    }
  } catch (e) {
    baseAmount = config.tshirt.price * quantity;
  }
  
  const fee = (baseAmount * config.paystack.feePercentage) / 100;
  return Number((baseAmount + fee).toFixed(2));
};

// Create temporary order reference and calculated amount for Paystack checkout
export const prepareOrder = async (data: OrderData) => {
  const orderReference = generateOrderReference();
  const amount = calculateOrderAmount(data.quantity, data.size);
  return {
    order_reference: orderReference,
    amount,
  };
};

// Insert into database ONLY when payment is verified successful
export const savePaidOrder = async (
  orderReference: string,
  paystackReference: string,
  data: OrderData,
  amount: number
) => {
  // Check if order already saved
  const existing = await getOrderByReference(orderReference);
  if (existing) {
    if (existing.payment_status !== 'PAID') {
      await pool.execute(
        `UPDATE orders SET payment_status = 'PAID', paystack_reference = ? WHERE order_reference = ?`,
        [paystackReference, orderReference]
      );
    }
    return existing;
  }

  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO orders (order_reference, name, index_number, phone, size, quantity, amount, payment_status, delivery_status, paystack_reference)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PAID', 'PENDING', ?)`,
    [
      orderReference,
      data.name.trim(),
      data.index_number.trim(),
      data.phone.trim(),
      data.size,
      data.quantity,
      amount,
      paystackReference,
    ]
  );

  return {
    id: result.insertId,
    order_reference: orderReference,
    amount,
    payment_status: 'PAID',
    delivery_status: 'PENDING',
  };
};

export const createOrder = async (data: OrderData) => {
  const prep = await prepareOrder(data);
  return prep;
};

export const getOrderByReference = async (reference: string) => {
  const [rows] = await pool.execute<Order[]>(
    'SELECT * FROM orders WHERE order_reference = ?',
    [reference]
  );
  return rows[0] || null;
};

export const getOrderByPaystackReference = async (paystackRef: string) => {
  const [rows] = await pool.execute<Order[]>(
    'SELECT * FROM orders WHERE paystack_reference = ?',
    [paystackRef]
  );
  return rows[0] || null;
};

export const updatePaystackReference = async (orderReference: string, paystackReference: string) => {
  await pool.execute(
    'UPDATE orders SET paystack_reference = ? WHERE order_reference = ?',
    [paystackReference, orderReference]
  );
};

export const updatePaymentStatus = async (orderReference: string, status: 'PENDING' | 'PAID' | 'FAILED') => {
  await pool.execute(
    'UPDATE orders SET payment_status = ? WHERE order_reference = ?',
    [status, orderReference]
  );
};

export const updateDeliveryStatus = async (id: number, status: 'PENDING' | 'DELIVERED') => {
  const [result] = await pool.execute<ResultSetHeader>(
    'UPDATE orders SET delivery_status = ? WHERE id = ?',
    [status, id]
  );
  return result.affectedRows > 0;
};

export const deleteOrder = async (id: number): Promise<boolean> => {
  const [result] = await pool.execute<ResultSetHeader>(
    'DELETE FROM orders WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

export const getAllOrders = async (search?: string, status?: string, deliveryStatus?: string) => {
  let query = 'SELECT * FROM orders';
  const params: string[] = [];
  const conditions: string[] = [];

  if (status && ['PENDING', 'PAID', 'FAILED'].includes(status)) {
    conditions.push('payment_status = ?');
    params.push(status);
  }

  if (deliveryStatus && ['PENDING', 'DELIVERED'].includes(deliveryStatus)) {
    conditions.push('delivery_status = ?');
    params.push(deliveryStatus);
  }

  if (search) {
    conditions.push('(name LIKE ? OR index_number LIKE ? OR order_reference LIKE ? OR phone LIKE ?)');
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  query += ' ORDER BY created_at DESC';

  const [rows] = await pool.execute<Order[]>(query, params);
  return rows;
};

export const getOrderStats = async () => {
  const [totalRows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM orders'
  );
  const [paidRows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM orders WHERE payment_status = ?',
    ['PAID']
  );
  const [deliveredRows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM orders WHERE delivery_status = ?',
    ['DELIVERED']
  );
  const [pendingDeliveryRows] = await pool.execute<RowDataPacket[]>(
    'SELECT COUNT(*) as count FROM orders WHERE delivery_status = ? AND payment_status = ?',
    ['PENDING', 'PAID']
  );
  const [salesRows] = await pool.execute<RowDataPacket[]>(
    'SELECT COALESCE(SUM(amount), 0) as total FROM orders WHERE payment_status = ?',
    ['PAID']
  );

  return {
    totalOrders: totalRows[0].count,
    paidOrders: paidRows[0].count,
    deliveredOrders: deliveredRows[0].count,
    pendingDeliveries: pendingDeliveryRows[0].count,
    totalSales: salesRows[0].total,
  };
};
