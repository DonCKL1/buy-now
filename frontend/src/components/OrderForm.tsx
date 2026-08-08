import React from 'react';
import { FiUser, FiCreditCard, FiPhone } from 'react-icons/fi';

interface FormErrors {
  name?: string;
  index_number?: string;
  phone?: string;
}

interface OrderFormProps {
  name: string;
  indexNumber: string;
  phone: string;
  errors: FormErrors;
  onNameChange: (val: string) => void;
  onIndexNumberChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  name,
  indexNumber,
  phone,
  errors,
  onNameChange,
  onIndexNumberChange,
  onPhoneChange,
}) => {
  return (
    <div className="section-card order-form-card">
      <h3 className="section-title">YOUR DETAILS</h3>

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Full Name <span className="required-star">*</span>
        </label>
        <div className="input-with-icon">
          <FiUser className="field-icon" />
          <input
            id="name"
            type="text"
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="e.g. Emmanuel Mensah"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            autoComplete="name"
          />
        </div>
        {errors.name && <p className="form-error">{errors.name}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="index_number" className="form-label">
          Student Number <span className="required-star">*</span>
        </label>
        <div className="input-with-icon">
          <FiCreditCard className="field-icon" />
          <input
            id="index_number"
            type="text"
            className={`form-input ${errors.index_number ? 'error' : ''}`}
            placeholder="e.g. Student ID Number"
            value={indexNumber}
            onChange={(e) => onIndexNumberChange(e.target.value)}
          />
        </div>
        {errors.index_number && <p className="form-error">{errors.index_number}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="phone" className="form-label">
          Phone Number <span className="required-star">*</span>
        </label>
        <div className="input-with-icon">
          <FiPhone className="field-icon" />
          <input
            id="phone"
            type="tel"
            className={`form-input ${errors.phone ? 'error' : ''}`}
            placeholder="e.g. 0241234567"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            autoComplete="tel"
          />
        </div>
        {errors.phone && <p className="form-error">{errors.phone}</p>}
      </div>
    </div>
  );
};

export default OrderForm;
