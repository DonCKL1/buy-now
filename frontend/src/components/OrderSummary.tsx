import React from 'react';

interface OrderSummaryProps {
  tshirtName: string;
  classicTshirtQty: number;
  classicTshirtSizes: string[];
  limitedTshirtQty: number;
  limitedTshirtSizes: string[];
  mugQty: number;
  bagQty: number;
  price: number;
  feePercentage?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  tshirtName,
  classicTshirtQty,
  classicTshirtSizes,
  limitedTshirtQty,
  limitedTshirtSizes,
  mugQty,
  bagQty,
  price,
}) => {
  const subtotal = (classicTshirtQty * price) + (limitedTshirtQty * 80) + (mugQty * 60) + (bagQty * 80);

  return (
    <div className="summary-card">
      <h3 className="summary-title">Order Summary</h3>

      {classicTshirtQty > 0 && (
        <div className="summary-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span className="label">{tshirtName || 'Classic T-Shirt'} (x{classicTshirtQty})</span>
            <span className="value">GHS {(classicTshirtQty * price).toFixed(2)}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            Sizes: {classicTshirtSizes.filter(s => s).join(', ') || 'Not selected'}
          </div>
        </div>
      )}

      {limitedTshirtQty > 0 && (
        <div className="summary-row" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '5px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
            <span className="label">Limited Edition T-Shirt (x{limitedTshirtQty})</span>
            <span className="value">GHS {(limitedTshirtQty * 80).toFixed(2)}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666' }}>
            Sizes: {limitedTshirtSizes.filter(s => s).join(', ') || 'Not selected'}
          </div>
        </div>
      )}

      {mugQty > 0 && (
        <div className="summary-row">
          <span className="label">Mug (x{mugQty})</span>
          <span className="value">GHS {(mugQty * 60).toFixed(2)}</span>
        </div>
      )}

      {bagQty > 0 && (
        <div className="summary-row">
          <span className="label">Tote Bag (x{bagQty})</span>
          <span className="value">GHS {(bagQty * 80).toFixed(2)}</span>
        </div>
      )}
      
      {subtotal === 0 && (
        <div className="summary-row">
          <span className="label" style={{ color: '#999', fontStyle: 'italic' }}>No items selected</span>
        </div>
      )}

      <hr className="summary-divider" />

      <div className="summary-total">
        <span className="label">Total Amount</span>
        <span className="value">GHS {subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
