import React from 'react';
import { FiShoppingBag, FiShield, FiLock, FiCheckCircle } from 'react-icons/fi';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import OrderForm from './OrderForm';
import OrderSummary from './OrderSummary';

interface OrderSectionProps {
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

const OrderSection: React.FC<OrderSectionProps> = ({
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
  const subtotal = quantity * price;
  const fee = (subtotal * feePercentage) / 100;
  const totalPayable = subtotal + fee;

  return (
    <section id="order" className="order-section">
      <div className="section-header-center" data-aos="fade-up">
        <span className="section-eyebrow">ORDER YOUR MERCH</span>
        <h2 className="section-title-large">READY TO GET YOURS?</h2>
        <p className="section-subtitle">Place your order in less than a minute.</p>
      </div>

      <div className="order-card-container" data-aos="fade-up" data-aos-delay="100">
        <div className="order-grid-two-col">
          {/* Left Column: Live Order Preview */}
          <div className="order-left-summary">
            <div className="live-preview-box">
              <div className="preview-badge">Live Order Preview</div>
              <div className="preview-image-wrap">
                <img src="/tshirt.svg" alt={tshirtName} className="preview-tshirt-img" />
              </div>
              <div className="preview-meta">
                <h4 className="preview-title">{tshirtName}</h4>
                <p className="preview-class">{className} · Class of {classYear}</p>
                <div className="preview-chips">
                  <span className="chip">Size: <strong>{size || 'Not selected'}</strong></span>
                  <span className="chip">Qty: <strong>{quantity}</strong></span>
                </div>
              </div>
            </div>

            <div className="trust-card">
              <div className="trust-card-item">
                <FiShield className="trust-icon" />
                <div>
                  <h5>Verified Server Security</h5>
                  <p>All calculations verified on server side.</p>
                </div>
              </div>
              <div className="trust-card-item">
                <FiLock className="trust-icon" />
                <div>
                  <h5>Paystack Instant Checkout</h5>
                  <p>Pay safely using Mobile Money, Card, or Bank transfer.</p>
                </div>
              </div>
              <div className="trust-card-item">
                <FiCheckCircle className="trust-icon" />
                <div>
                  <h5>Official Class Distribution</h5>
                  <p>Handed out directly by class executives.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Size, Qty, Inputs & Order Form */}
          <div className="order-right-form">
            <SizeSelector selected={size} onSelect={onSizeSelect} />
            {errors.size && <p className="form-error-standalone">{errors.size}</p>}

            <QuantitySelector
              quantity={quantity}
              price={price}
              feePercentage={feePercentage}
              onChange={onQuantityChange}
            />

            <OrderForm
              name={name}
              indexNumber={indexNumber}
              phone={phone}
              errors={errors}
              onNameChange={onNameChange}
              onIndexNumberChange={onIndexNumberChange}
              onPhoneChange={onPhoneChange}
            />

            <OrderSummary
              tshirtName={tshirtName}
              size={size || '—'}
              quantity={quantity}
              price={price}
              feePercentage={feePercentage}
            />

            <button
              onClick={onSubmit}
              disabled={submitting}
              className="pay-submit-btn"
              id="pay-btn"
            >
              {submitting ? (
                <>
                  <div className="spinner"></div>
                  Processing Order...
                </>
              ) : (
                <>
                  <FiLock size={20} />
                  PAY NOW • GHS {totalPayable.toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSection;
