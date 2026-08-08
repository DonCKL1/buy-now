import React from 'react';
import { FiCheck, FiShoppingBag } from 'react-icons/fi';

interface ProductShowcaseProps {
  tshirtName: string;
  className: string;
  classYear: string;
  price: number;
  onOrderClick: () => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  tshirtName,
  className,
  classYear,
  price,
  onOrderClick,
}) => {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <section id="showcase" className="showcase-section">
      <div className="section-header-center" data-aos="fade-up">
        <span className="section-eyebrow">THE OFFICIAL MERCHANDISE</span>
        <h2 className="section-title-large">THE OFFICIAL FINAL YEAR T-SHIRT</h2>
        <p className="section-subtitle">One shirt. One journey. One memory.</p>
      </div>

      <div className="showcase-card" data-aos="zoom-in" data-aos-delay="100">
        <div className="showcase-grid">
          {/* Left: Large SVG Display */}
          <div className="showcase-media">
            <div className="showcase-glow-bg"></div>
            <img
              src="/tshirt.svg"
              alt={tshirtName}
              className="showcase-svg-img"
            />
          </div>

          {/* Right: Product Info & Sizes */}
          <div className="showcase-details">
            <div className="showcase-tag">{className} · {classYear}</div>
            <h3 className="showcase-name">{tshirtName}</h3>
            <p className="showcase-desc">
              Designed with precision for our graduating cohort. Featuring high-grade fabric,
              durable stitching, and custom insignia representing our tech legacy.
            </p>

            <div className="showcase-price-box">
              <span className="unit-label">Price per shirt</span>
              <span className="unit-price">GHS {price.toFixed(2)}</span>
            </div>

            <div className="showcase-sizes-box">
              <span className="sizes-title">Available Sizes</span>
              <div className="sizes-pills-grid">
                {sizes.map((sz) => (
                  <div key={sz} className="size-pill-item">
                    <span>{sz}</span>
                  </div>
                ))}
              </div>
            </div>

            <ul className="showcase-bullets">
              <li><FiCheck className="bullet-icon" /> Official graduation class memorabilia</li>
              <li><FiCheck className="bullet-icon" /> Breathable premium cotton blend</li>
              <li><FiCheck className="bullet-icon" /> Precision front & back custom graphics</li>
            </ul>

            <button onClick={onOrderClick} className="showcase-btn">
              <FiShoppingBag /> ORDER YOURS NOW
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
