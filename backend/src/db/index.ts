import mysql from 'mysql2/promise';
import { config } from '../config';

const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const initDatabase = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');

    // Create orders table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_reference VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(150) NOT NULL,
        index_number VARCHAR(100) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        size TEXT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        amount DECIMAL(10,2) NOT NULL,
        payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
        delivery_status ENUM('PENDING', 'DELIVERED') DEFAULT 'PENDING',
        paystack_reference VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payment_status (payment_status),
        INDEX idx_delivery_status (delivery_status),
        INDEX idx_order_reference (order_reference),
        INDEX idx_paystack_reference (paystack_reference),
        INDEX idx_created_at (created_at)
      )
    `);

    // Ensure delivery_status column exists if table was created previously
    try {
      await connection.execute(`
        ALTER TABLE orders ADD COLUMN delivery_status ENUM('PENDING', 'DELIVERED') DEFAULT 'PENDING' AFTER payment_status
      `);
    } catch (e: any) {
      // Column already exists, ignore error code 1060 (Duplicate column name)
    }

    try {
      await connection.execute(`
        ALTER TABLE orders MODIFY COLUMN size TEXT NOT NULL
      `);
    } catch (e: any) {
      console.log('Could not modify size column:', e.message);
    }

    connection.release();
    console.log('Database tables verified with delivery_status support');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};

export default pool;
