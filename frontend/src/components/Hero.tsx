import React from 'react';
import {
  FiShoppingBag,
  FiAward,
  FiShield,
  FiZap,
  FiLock,
  FiArrowDown,
} from 'react-icons/fi';

interface HeroProps {
  tshirtName: string;
  className: string;
  classYear: string;
  price: number;
  onOrderClick: () => void;
}

const Hero: React.FC<HeroProps> = ({
  tshirtName,
  className,
  classYear,
  price,
  onOrderClick,
}) => {
  return (
    <section className="hero-section-white hero-bg-class2">
      <div className="hero-backdrop-overlay"></div>
      <div className="hero-container">
        {/* Left Column: Headline & Details */}
        <div className="hero-text-content" data-aos="fade-right">
          <div className="hero-badge-light">
            <FiAward className="badge-icon" />
            <span>OFFICIAL FINAL YEAR COLLECTION · {classYear}</span>
          </div>

          <h1 className="hero-title-dark">
            WEAR THE MOMENT. <br />
            <span className="hero-title-highlight-blue">REMEMBER THE JOURNEY.</span>
          </h1>

          <p className="hero-description-dark">
            The official final-year T-shirt designed exclusively for{' '}
            <strong>{className}</strong>. A premium keepsake crafted to celebrate our achievements and memories together.
          </p>

          <div className="hero-price-tag-light">
            <span className="price-label-dark">Official Price:</span>
            <span className="price-value-blue">GHS {price.toFixed(2)}</span>
            <span className="price-guarantee-dark">
              <FiShield /> Verified Class Item
            </span>
          </div>

          <div className="hero-actions">
            <button
              onClick={onOrderClick}
              className="hero-cta-btn-primary"
              id="hero-order-btn"
            >
              <FiShoppingBag /> ORDER YOUR T-SHIRT
            </button>

            <a href="#showcase" className="hero-secondary-btn-dark">
              View Details <FiArrowDown />
            </a>
          </div>

          <div className="hero-meta-pills-light">
            <div className="meta-pill-light">
              <FiAward className="pill-icon" /> Class of {classYear} Edition
            </div>
            <div className="meta-pill-light">
              <FiZap className="pill-icon" /> Limited Print Run
            </div>
            <div className="meta-pill-light">
              <FiLock className="pill-icon" /> Instant Paystack Checkout
            </div>
          </div>
        </div>

        {/* Right Column: Featured Class Photo Card */}
        <div className="hero-visual" data-aos="fade-left" data-aos-delay="150">
          <div className="hero-class-card">
            <img
              src="/class.jpg"
              alt="Final Year Graduating Class"
              className="hero-class-img"
            />

            {/* Embedded T-Shirt Badge Overlay */}
            <div className="hero-tshirt-floating-badge">
              <img src="/tshirt.svg" alt={tshirtName} className="badge-tshirt-thumb" />
              <div className="badge-text-group">
                <span className="badge-name">{tshirtName}</span>
                <span className="badge-price">GHS {price.toFixed(2)}</span>
              </div>
            </div>

            <div className="hero-card-caption">
              <span className="caption-title">{className}</span>
              <span className="caption-sub">Class of {classYear} Memory</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
