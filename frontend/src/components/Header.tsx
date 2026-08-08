import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiShoppingBag, FiAward, FiSmartphone } from 'react-icons/fi';

interface HeaderProps {
  className?: string;
  classYear?: string;
  onOpenOrderModal?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  className = 'CKL TECH',
  classYear = '2026',
  onOpenOrderModal,
}) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="site-header-white">
      <div className="header-container">
        {/* Brand Logo & Title */}
        <Link to="/" className="brand-logo-link">
          <div className="brand-badge-wrapper">
            <img
              src="/logo.png"
              alt={`${className} Logo`}
              className="brand-logo-img"
            />
          </div>
          <div className="brand-text">
            <h1 className="brand-title-dark">{className}</h1>

          </div>
        </Link>

        {/* Header Right Actions */}
        {!isAdmin ? (
          <div className="header-cta-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="mobile-header-badge" style={{ display: 'none' }}>
              <FiSmartphone size={14} color="#2563eb" />
            </span>
            <button
              onClick={onOpenOrderModal}
              className="header-order-btn"
              id="header-order-now-btn"
            >
              <FiShoppingBag className="btn-icon" />
              <span>Order Now</span>
            </button>
          </div>
        ) : (
          <nav className="desktop-nav">
            <Link to="/" className="hero-secondary-btn-dark" style={{ fontSize: '0.78rem', padding: '0.4rem 0.8rem' }}>
              ← Return to Store
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
