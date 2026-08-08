import React from 'react';

interface OrderSummaryProps {
  tshirtName: string;
  size: string;
  quantity: number;
  price: number;
  feePercentage?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  tshirtName,
  size,
  quantity,
  price,
}) => {
  const subtotal = quantity * price;

  return (
    <div className="summary-card">
      <h3 className="summary-title">Order Summary</h3>

      <div className="summary-row">
        <span className="label">Item</span>
        <span className="value">{tshirtName}</span>
      </div>
      <div className="summary-row">
        <span className="label">Size</span>
        <span className="value">{size}</span>
      </div>
      <div className="summary-row">
        <span className="label">Quantity</span>
        <span className="value">{quantity}</span>
      </div>
      <div className="summary-row">
        <span className="label">Unit Price</span>
        <span className="value">GHS {price.toFixed(2)}</span>
      </div>

      <hr className="summary-divider" />

      <div className="summary-total">
        <span className="label">Total Amount</span>
        <span className="value">GHS {subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
