import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),

  database: {
    host: process.env.MYSQLHOST || process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.MYSQLPORT || process.env.DATABASE_PORT || '3306', 10),
    name: process.env.MYSQLDATABASE || process.env.DATABASE_NAME || 'final_year_tshirt',
    user: process.env.MYSQLUSER || process.env.DATABASE_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DATABASE_PASSWORD || '',
  },

  paystack: {
    secretKey: process.env.PAYSTACK_SECRET_KEY || '',
    publicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
    feePercentage: parseFloat(process.env.PAYSTACK_FEE_PERCENTAGE || '1.95'),
  },

  arkesel: {
    apiKey: process.env.ARKESEL_API_KEY || '',
    senderId: process.env.ARKESEL_SENDER_ID || 'CKLTECH',
  },

  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  admin: {
    username: process.env.ADMIN_USERNAME || 'admin',
    password: process.env.ADMIN_PASSWORD || 'password123',
  },

  tshirt: {
    price: parseFloat(process.env.TSHIRT_PRICE || '50'),
    name: process.env.TSHIRT_NAME || 'Final Year T-Shirt',
    className: process.env.CLASS_NAME || 'Bachelor of Technology Computer Technology',
    classYear: process.env.CLASS_YEAR || '2026',
  },
};
