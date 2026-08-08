import React from 'react';

interface ProductCardProps {
  name: string;
  className: string;
  classYear: string;
  price: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ name, className, classYear, price }) => {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src="/tshirt.svg"
          alt={`${name} - ${className} ${classYear}`}
          draggable={false}
        />
      </div>
      <div className="product-info">
        <h2 className="product-name">{name}</h2>
        <p className="product-class">{className} · Class of {classYear}</p>
        <p className="product-price">
          GHS {price.toFixed(2)}
          <span>per shirt</span>
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
