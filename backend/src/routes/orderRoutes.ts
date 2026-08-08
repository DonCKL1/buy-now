import { Router } from 'express';
import * as orderController from '../controllers/orderController';
import { orderValidation } from '../middleware/validation';

const router = Router();

// Create a new order
router.post('/orders', orderValidation, orderController.createOrder);

// Initialize payment
router.post('/payment/initialize', orderController.initializePayment);

// Verify payment
router.get('/payment/verify/:reference', orderController.verifyPayment);

// Get public config (price, name, etc.)
router.get('/config', orderController.getConfig);

export default router;
