import React from 'react';
import { FiCheck } from 'react-icons/fi';

interface OrderDetails {
  order_reference: string;
  name: string;
  amount: number;
  size: string;
  quantity: number;
}

interface SuccessMessageProps {
  order: OrderDetails;
  onDone: () => void;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ order, onDone }) => {
  return (
    <div className="success-container page-enter">
      <div className="success-icon-badge">
        <FiCheck size={42} />
      </div>

      <span className="success-eyebrow">ORDER CONFIRMED</span>
      <h2 className="success-title">Thank you, {order.name.split(' ')[0]}.</h2>
      <p className="success-subtitle">
        Your final-year T-shirt order has been successfully received.
      </p>

      <div className="success-details-card">
        <div className="success-detail-row">
          <span className="label">ORDER REFERENCE</span>
          <span className="value ref-highlight">{order.order_reference}</span>
        </div>
        <div className="success-detail-row">
          <span className="label">AMOUNT PAID</span>
          <span className="value">GHS {Number(order.amount).toFixed(2)}</span>
        </div>
        <div className="success-detail-row">
          <span className="label">SIZE</span>
          <span className="value size-pill-sm">{order.size}</span>
        </div>
        <div className="success-detail-row">
          <span className="label">QUANTITY</span>
          <span className="value">{order.quantity}</span>
        </div>
      </div>

      <button className="done-btn-action" onClick={onDone} id="done-btn">
        ORDER ANOTHER SHIRT
      </button>
    </div>
  );
};

export default SuccessMessage;
