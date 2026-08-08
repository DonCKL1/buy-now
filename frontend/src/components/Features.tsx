import React from 'react';
import { FiAward, FiLayers, FiMaximize2, FiBookmark } from 'react-icons/fi';

const Features: React.FC = () => {
  const featureList = [
    {
      icon: <FiAward />,
      title: 'FINAL YEAR EDITION',
      desc: 'Official shirt created exclusively for our graduating class cohort.',
    },
    {
      icon: <FiLayers />,
      title: 'PREMIUM DESIGN',
      desc: 'A clean, high-quality aesthetic made to represent our technology journey.',
    },
    {
      icon: <FiMaximize2 />,
      title: 'MULTIPLE SIZES',
      desc: 'Accurately sized options from Small (S) to Extra Extra Large (XXL).',
    },
    {
      icon: <FiBookmark />,
      title: 'CLASS MEMORY',
      desc: 'A simple, lasting keepsake to remember our mates, lecturers, and milestones.',
    },
  ];

  return (
    <section id="features" className="features-section">
      <div className="section-header-center" data-aos="fade-up">
        <span className="section-eyebrow">WHY GET YOUR SHIRT</span>
        <h2 className="section-title-large">HIGHLIGHT FEATURES</h2>
        <p className="section-subtitle">Crafted with attention to detail for every student.</p>
      </div>

      <div className="features-grid">
        {featureList.map((feat, idx) => (
          <div
            key={feat.title}
            className="feature-card"
            data-aos="fade-up"
            data-aos-delay={idx * 100}
          >
            <div className="feature-icon-wrapper">{feat.icon}</div>
            <h3 className="feature-title">{feat.title}</h3>
            <p className="feature-desc">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
