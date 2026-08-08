import React from 'react';
import { FiX, FiLock, FiShield, FiShoppingBag } from 'react-icons/fi';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  tshirtName: string;
  className: string;
  classYear: string;
  price: number;
  feePercentage: number;
  size: string;
  quantity: number;
  name: string;
  indexNumber: string;
  phone: string;
  errors: Record<string, string>;
  submitting: boolean;
  onSizeSelect: (size: string) => void;
  onQuantityChange: (qty: number) => void;
  onNameChange: (val: string) => void;
  onIndexNumberChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onSubmit: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  tshirtName,
  className,
  classYear,
  price,
  feePercentage,
  size,
  quantity,
  name,
  indexNumber,
  phone,
  errors,
  submitting,
  onSizeSelect,
  onQuantityChange,
  onNameChange,
  onIndexNumberChange,
  onPhoneChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const totalAmount = quantity * price;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge">
              <FiShoppingBag /> Official Order Selection
            </div>
            <h3 className="modal-headline">Place Your T-Shirt Order</h3>
            <p className="modal-subtext">{className} · Class of {classYear}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Size Selector */}
          <SizeSelector selected={size} onSelect={onSizeSelect} />
          {errors.size && <p className="form-error-standalone">{errors.size}</p>}

          {/* Quantity Selector */}
          <QuantitySelector
            quantity={quantity}
            price={price}
            feePercentage={feePercentage}
            onChange={onQuantityChange}
          />

          {/* Personal Info Form */}
          <OrderForm
            name={name}
            indexNumber={indexNumber}
            phone={phone}
            errors={errors}
            onNameChange={onNameChange}
            onIndexNumberChange={onIndexNumberChange}
            onPhoneChange={onPhoneChange}
          />

          {/* Order Summary */}
          <OrderSummary
            tshirtName={tshirtName}
            size={size || '—'}
            quantity={quantity}
            price={price}
            feePercentage={feePercentage}
          />

          {/* Payment CTA */}
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="modal-pay-btn"
            id="modal-pay-btn"
          >
            {submitting ? (
              <>
                <div className="spinner"></div>
                Opening Paystack...
              </>
            ) : (
              <>
                <FiLock size={20} />
                PROCEED TO PAY • GHS {totalAmount.toFixed(2)}
              </>
            )}
          </button>

          <div className="modal-security-note">
            <FiShield /> <span>Secured by Paystack </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
