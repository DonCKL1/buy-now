import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { adminAuth } from '../middleware/auth';

const router = Router();

// All admin routes require authentication
router.use(adminAuth);

// Admin login check
router.post('/login', adminController.login);

// Get all orders
router.get('/orders', adminController.getOrders);

// Get order statistics
router.get('/stats', adminController.getStats);

// Update order delivery status
router.patch('/orders/:id/delivery', adminController.updateDeliveryStatus);

// Delete order
router.delete('/orders/:id', adminController.deleteOrder);

// Export orders as CSV
router.get('/orders/export', adminController.exportOrders);

// Send custom message to order
router.post('/orders/:id/message', adminController.sendOrderMessage);

export default router;
