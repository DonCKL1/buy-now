-- Final Year T-Shirt Ordering System
-- Safe Production Database Schema

CREATE DATABASE IF NOT EXISTS final_year_tshirt;
USE final_year_tshirt;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_reference VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    index_number VARCHAR(100) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    size VARCHAR(10) NOT NULL,
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
);
