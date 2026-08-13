import React from 'react';
import { FiCheck } from 'react-icons/fi';

const SIZES = [
  { label: 'S', name: 'Small' },
  { label: 'M', name: 'Medium' },
  { label: 'L', name: 'Large' },
  { label: 'XL', name: 'X-Large' },
  { label: 'XXL', name: '2X-Large' },
  { label: 'XXXL', name: '3X-Large' },
];

interface SizeSelectorProps {
  selected: string;
  onSelect: (size: string) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="section-card size-selector-card">
      <div className="section-title-row">
        <h3 className="section-title">SELECT SIZE</h3>
        {selected && <span className="selected-size-tag">Chosen: <strong>{selected}</strong></span>}
      </div>

      <div className="size-grid">
        {SIZES.map((item) => {
          const isSelected = selected === item.label;
          return (
            <button
              key={item.label}
              type="button"
              className={`size-card-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelect(item.label)}
              id={`size-${item.label.toLowerCase()}`}
            >
              <div className="size-card-label">{item.label}</div>
              <div className="size-card-name">{item.name}</div>
              {isSelected && <FiCheck className="size-check-icon" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SizeSelector;
