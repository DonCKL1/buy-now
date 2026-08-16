import { Request, Response } from 'express';
import * as orderService from '../services/orderService';
import { Parser } from 'json2csv';
import { sendDeliverySMS, sendCustomSMS } from '../services/smsService';

export const login = async (req: Request, res: Response): Promise<void> => {
  res.json({ message: 'Login successful' });
};

export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const deliveryStatus = typeof req.query.delivery_status === 'string' ? req.query.delivery_status : undefined;
    const orders = await orderService.getAllOrders(search, status, deliveryStatus);
    res.json({ orders });
  } catch (error: any) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Failed to retrieve orders' });
  }
};

export const getStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await orderService.getOrderStats();
    res.json({ stats });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to retrieve statistics' });
  }
};

export const updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramId = req.params.id;
    const id = parseInt(Array.isArray(paramId) ? paramId[0] : paramId, 10);
    const { delivery_status } = req.body;

    if (isNaN(id) || !['PENDING', 'DELIVERED'].includes(delivery_status)) {
      res.status(400).json({ error: 'Invalid order ID or delivery status' });
      return;
    }

    const updated = await orderService.updateDeliveryStatus(id, delivery_status);
    if (!updated) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    if (delivery_status === 'DELIVERED') {
      const order = await orderService.getOrderById(id);
      if (order) {
        sendDeliverySMS({
          to: order.phone,
          name: order.name,
          orderReference: order.order_reference,
        }).catch(err => console.error('Non-blocking delivery SMS error:', err));
      }
    }

    res.json({ message: 'Delivery status updated successfully', delivery_status });
  } catch (error: any) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ error: 'Failed to update delivery status' });
  }
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramId = req.params.id;
    const id = parseInt(Array.isArray(paramId) ? paramId[0] : paramId, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: 'Invalid order ID' });
      return;
    }

    const deleted = await orderService.deleteOrder(id);
    if (!deleted) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    res.json({ message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Delete order error:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
};

export const exportOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const deliveryStatus = typeof req.query.delivery_status === 'string' ? req.query.delivery_status : undefined;
    const orders = await orderService.getAllOrders(undefined, status, deliveryStatus);

    const formatSizePayload = (sizeStr: string) => {
      if (!sizeStr || !sizeStr.startsWith('{')) return sizeStr;
      try {
        const data = JSON.parse(sizeStr);
        const parts = [];
        if (data.classicTshirt?.qty > 0) {
          const sizes = (data.classicTshirt.sizes || []).filter(Boolean).join(', ');
          parts.push(`${data.classicTshirt.qty}x Classic ${sizes ? `(${sizes})` : ''}`);
        }
        if (data.limitedTshirt?.qty > 0) {
          const sizes = (data.limitedTshirt.sizes || []).filter(Boolean).join(', ');
          parts.push(`${data.limitedTshirt.qty}x Ltd Edition ${sizes ? `(${sizes})` : ''}`);
        }
        if (data.mug?.qty > 0) {
          parts.push(`${data.mug.qty}x Mug`);
        }
        if (data.bag?.qty > 0) {
          parts.push(`${data.bag.qty}x Tote Bag`);
        }
        return parts.join(' | ') || sizeStr;
      } catch (e) {
        return sizeStr;
      }
    };

    const formattedOrders = orders.map((order) => ({
      ...order,
      size: formatSizePayload(order.size),
    }));

    const fields = [
      { label: 'Order Reference', value: 'order_reference' },
      { label: 'Name', value: 'name' },
      { label: 'Student ID', value: 'index_number' },
      { label: 'Phone', value: 'phone' },
      { label: 'Size', value: 'size' },
      { label: 'Quantity', value: 'quantity' },
      { label: 'Amount (GHS)', value: 'amount' },
      { label: 'Payment Status', value: 'payment_status' },
      { label: 'Delivery Status', value: 'delivery_status' },
      { label: 'Date', value: 'created_at' },
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(formattedOrders);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=orders-${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csv);
  } catch (error: any) {
    console.error('Export orders error:', error);
    res.status(500).json({ error: 'Failed to export orders' });
  }
};

export const sendOrderMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const paramId = req.params.id;
    const id = parseInt(Array.isArray(paramId) ? paramId[0] : paramId, 10);
    const { customMessage } = req.body;

    if (isNaN(id) || !customMessage) {
      res.status(400).json({ error: 'Invalid order ID or message content' });
      return;
    }

    const order = await orderService.getOrderById(id);
    if (!order) {
      res.status(404).json({ error: 'Order not found' });
      return;
    }

    const sent = await sendCustomSMS({
      to: order.phone,
      name: order.name,
      orderReference: order.order_reference,
      customMessage: customMessage,
    });

    if (sent) {
      res.json({ message: 'Message sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send message via Arkesel' });
    }
  } catch (error: any) {
    console.error('Send order message error:', error);
    res.status(500).json({ error: 'Internal server error while sending message' });
  }
};

export const sendBulkOrderMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customMessage, orderIds } = req.body;

    if (!customMessage) {
      res.status(400).json({ error: 'Message content is required' });
      return;
    }

    // Fetch all orders with PENDING delivery status
    let pendingOrders = await orderService.getAllOrders(undefined, undefined, 'PENDING');

    if (Array.isArray(orderIds) && orderIds.length > 0) {
      pendingOrders = pendingOrders.filter(order => orderIds.includes(order.id));
    }

    if (pendingOrders.length === 0) {
      res.status(404).json({ error: 'No matching pending deliveries found' });
      return;
    }

    let successCount = 0;
    let failCount = 0;

    // Send SMS sequentially or concurrently (sequentially to avoid rate limiting)
    for (const order of pendingOrders) {
      const sent = await sendCustomSMS({
        to: order.phone,
        name: order.name,
        orderReference: order.order_reference,
        customMessage: customMessage,
      });

      if (sent) {
        successCount++;
      } else {
        failCount++;
      }
    }

    res.json({
      message: 'Bulk messaging completed',
      successCount,
      failCount,
      totalCount: pendingOrders.length,
    });
  } catch (error: any) {
    console.error('Send bulk order message error:', error);
    res.status(500).json({ error: 'Internal server error while sending bulk messages' });
  }
};

