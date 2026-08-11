import React from 'react';
import { FiX, FiLock, FiShield, FiShoppingBag, FiMinus, FiPlus } from 'react-icons/fi';
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
  classicTshirtQty: number;
  classicTshirtSizes: string[];
  limitedTshirtQty: number;
  limitedTshirtSizes: string[];
  mugQty: number;
  bagQty: number;
  name: string;
  indexNumber: string;
  phone: string;
  errors: Record<string, string>;
  submitting: boolean;
  onClassicTshirtSizeChange: (index: number, size: string) => void;
  onClassicTshirtQtyChange: (qty: number) => void;
  onLimitedTshirtSizeChange: (index: number, size: string) => void;
  onLimitedTshirtQtyChange: (qty: number) => void;
  onMugQtyChange: (qty: number) => void;
  onBagQtyChange: (qty: number) => void;
  onNameChange: (val: string) => void;
  onIndexNumberChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onSubmit: () => void;
}

const QuantityControl = ({ label, price, quantity, onChange, min = 0 }: any) => (
  <div className="item-qty-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <strong style={{ fontSize: '1.1rem', color: '#333' }}>{label}</strong>
      <span style={{ color: '#666', fontSize: '0.95rem' }}>GHS {price.toFixed(2)}</span>
    </div>
    <div className="quantity-controls" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f8f9fa', padding: '5px', borderRadius: '8px' }}>
      <button type="button" className="qty-btn" style={{ padding: '8px', border: 'none', background: '#fff', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} onClick={() => onChange(Math.max(min, quantity - 1))} disabled={quantity <= min}><FiMinus /></button>
      <span style={{ width: '25px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>{quantity}</span>
      <button type="button" className="qty-btn" style={{ padding: '8px', border: 'none', background: '#fff', borderRadius: '5px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} onClick={() => onChange(quantity + 1)}><FiPlus /></button>
    </div>
  </div>
);

const SizeDropdown = ({ label, selected, onSelect }: any) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', background: '#fafafa', padding: '10px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
    <label style={{ fontSize: '0.9rem', color: '#444', minWidth: '70px', fontWeight: 600 }}>{label}:</label>
    <select
      value={selected}
      onChange={(e) => onSelect(e.target.value)}
      style={{
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ccc',
        flex: 1,
        background: '#fff',
        outline: 'none',
        fontSize: '0.9rem'
      }}
    >
      <option value="" disabled>Select Size</option>
      <option value="S">Small (S)</option>
      <option value="M">Medium (M)</option>
      <option value="L">Large (L)</option>
      <option value="XL">X-Large (XL)</option>
      <option value="XXL">2X-Large (XXL)</option>
    </select>
  </div>
);

const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  tshirtName,
  className,
  classYear,
  price,
  feePercentage,
  classicTshirtQty,
  classicTshirtSizes,
  limitedTshirtQty,
  limitedTshirtSizes,
  mugQty,
  bagQty,
  name,
  indexNumber,
  phone,
  errors,
  submitting,
  onClassicTshirtSizeChange,
  onClassicTshirtQtyChange,
  onLimitedTshirtSizeChange,
  onLimitedTshirtQtyChange,
  onMugQtyChange,
  onBagQtyChange,
  onNameChange,
  onIndexNumberChange,
  onPhoneChange,
  onSubmit,
}) => {
  if (!isOpen) return null;

  const subtotal = (classicTshirtQty * price) + (limitedTshirtQty * 80) + (mugQty * 60) + (bagQty * 80);
  const totalAmount = subtotal > 0 ? subtotal / (1 - feePercentage / 100) : 0;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        data-aos="zoom-in"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-badge">
              <FiShoppingBag /> Official Order Selection
            </div>
            <h3 className="modal-headline">Place Your Merchandise Order</h3>
            <p className="modal-subtext">{className} · Class of {classYear}</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="section-card">
            <h3 className="section-title">Select Merchandise</h3>
            
            {/* Classic T-Shirt */}
            <div style={{ marginBottom: classicTshirtQty > 0 ? '15px' : '0' }}>
              <QuantityControl label={tshirtName || 'Classic T-Shirt'} price={price} quantity={classicTshirtQty} onChange={onClassicTshirtQtyChange} min={0} />
              {classicTshirtQty > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {Array.from({ length: classicTshirtQty }).map((_, i) => (
                    <SizeDropdown key={`classic-${i}`} label={`Shirt ${i + 1}`} selected={classicTshirtSizes[i] || ''} onSelect={(size: string) => onClassicTshirtSizeChange(i, size)} />
                  ))}
                </div>
              )}
            </div>

            {/* Limited Edition T-Shirt */}
            <div style={{ marginBottom: limitedTshirtQty > 0 ? '15px' : '0' }}>
              <QuantityControl label="Limited Edition T-Shirt" price={80} quantity={limitedTshirtQty} onChange={onLimitedTshirtQtyChange} min={0} />
              {limitedTshirtQty > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {Array.from({ length: limitedTshirtQty }).map((_, i) => (
                    <SizeDropdown key={`limited-${i}`} label={`Shirt ${i + 1}`} selected={limitedTshirtSizes[i] || ''} onSelect={(size: string) => onLimitedTshirtSizeChange(i, size)} />
                  ))}
                </div>
              )}
            </div>
            
            <QuantityControl label="Custom Class Mug" price={60} quantity={mugQty} onChange={onMugQtyChange} min={0} />
            <QuantityControl label="Tech Legacy Tote Bag" price={80} quantity={bagQty} onChange={onBagQtyChange} min={0} />
            
            {errors.size && <p className="form-error-standalone">{errors.size}</p>}
            {errors.quantity && <p className="form-error-standalone">{errors.quantity}</p>}
          </div>

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
            classicTshirtQty={classicTshirtQty}
            classicTshirtSizes={classicTshirtSizes}
            limitedTshirtQty={limitedTshirtQty}
            limitedTshirtSizes={limitedTshirtSizes}
            mugQty={mugQty}
            bagQty={bagQty}
            price={price}
            feePercentage={feePercentage}
          />

          <button
            onClick={onSubmit}
            disabled={submitting || totalAmount === 0}
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
