import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface FailedMessageProps {
  onRetry: () => void;
}

const FailedMessage: React.FC<FailedMessageProps> = ({ onRetry }) => {
  return (
    <div className="failed-container page-enter">
      <div className="failed-icon-badge">
        <FiAlertCircle size={42} />
      </div>

      <h2 className="failed-title">Payment wasn't completed</h2>
      <p className="failed-subtitle">
        Your order has not been confirmed. Please try again.
      </p>

      <button className="retry-btn-action" onClick={onRetry} id="retry-btn">
        TRY PAYMENT AGAIN
      </button>
    </div>
  );
};

export default FailedMessage;
