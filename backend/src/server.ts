import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { initDatabase } from './db';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Trust reverse proxy (Render load balancer) for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Dynamic CORS configuration for development & Vercel production frontend
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like server-to-server, mobile apps, or Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        config.frontendUrl.replace(/\/$/, ''),
        'http://localhost:5173',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
      ];

      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      // Automatically allow Vercel deployment URLs (*.vercel.app)
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Order creation rate limit
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many order attempts, please try again later.' },
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api', orderLimiter, orderRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Production Error handler (No stack traces or internal secrets leaked)
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled server error:', err.message);
  res.status(500).json({ error: 'Internal server error. Please try again later.' });
});

// Start server
const start = async () => {
  try {
    await initDatabase();

    app.listen(config.port, '0.0.0.0', () => {
      console.log(`[SERVER] Running on port ${config.port}`);
      console.log(`[STORE] ${config.tshirt.name} - GHS ${config.tshirt.price}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
