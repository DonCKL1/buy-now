import React from 'react';
import { FiShield, FiGithub } from 'react-icons/fi';

interface FooterProps {
  className?: string;
  classYear?: string;
}

const Footer: React.FC<FooterProps> = ({
  className = 'CKL TECH',
  classYear = '2026',
}) => {
  return (
    <footer className="site-footer-white">
      <div className="footer-container">
        <div className="footer-brand">
          <img src="/logo.png" alt={className} className="footer-logo" />
          <div className="footer-brand-text">
            <h3 className="footer-title-dark">FINAL YEAR T-SHIRT</h3>
            <p className="footer-sub-dark">Official final-year collection for {className} · {classYear}</p>
          </div>
        </div>

        <div className="footer-middle">
          <p className="footer-dept">Computer Science / Computer Technology Department</p>
          <p className="footer-builder">
            Built by{' '}
            <a
              href="https://github.com/DonCKL1"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-github-link"
            >
              <FiGithub className="inline-icon" /> Calming King Lion
            </a>
          </p>
        </div>

        <div className="footer-bottom-white">
          <p>© {new Date().getFullYear()} Final Year Class. All Rights Reserved.</p>
          <div className="footer-security-dark">
            <FiShield /> <span>Encrypted & Verified via Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
