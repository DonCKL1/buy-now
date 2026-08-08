import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

interface QuantitySelectorProps {
  quantity: number;
  price: number;
  feePercentage?: number;
  onChange: (qty: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  price,
  onChange,
}) => {
  const subtotal = quantity * price;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) {
      onChange(val);
    } else if (e.target.value === '') {
      onChange(1);
    }
  };

  return (
    <div className="section-card">
      <h3 className="section-title">Quantity</h3>
      <div className="quantity-row">
        <div className="quantity-controls">
          <button
            type="button"
            className="qty-btn"
            onClick={() => onChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            id="qty-decrease"
          >
            <FiMinus />
          </button>
          <input
            type="number"
            min="1"
            max="100"
            className="qty-input-field"
            value={quantity}
            onChange={handleInputChange}
            id="qty-value"
          />
          <button
            type="button"
            className="qty-btn"
            onClick={() => onChange(quantity + 1)}
            id="qty-increase"
          >
            <FiPlus />
          </button>
        </div>
        <div className="quantity-total">
          <div className="label">Total Amount</div>
          <div className="amount">GHS {subtotal.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default QuantitySelector;
