import React from 'react';
import { FiCheck, FiShoppingBag } from 'react-icons/fi';

interface ProductShowcaseProps {
  tshirtName: string;
  className: string;
  classYear: string;
  price: number;
  onOrderClick: (itemId?: string) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  tshirtName,
  className,
  classYear,
  price,
  onOrderClick,
}) => {
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  const products = [
    {
      id: 'classic_tshirt',
      name: tshirtName || 'Classic Final Year T-Shirt',
      desc: 'The original class memorabilia. A timeless piece celebrating our graduation.',
      price: price,
      image: '/tshirt.svg',
      hasSizes: true,
      features: [
        'Standard class design',
        'Comfortable everyday wear',
        'High quality screen print'
      ]
    },
    {
      id: 'limited_tshirt',
      name: 'Limited Edition T-Shirt',
      desc: 'Designed with precision for our graduating cohort. Featuring high-grade fabric, durable stitching, and custom insignia representing our tech legacy.',
      price: 80,
      image: '/tshirt2.jpeg',
      hasSizes: true,
      features: [
        'Official graduation class memorabilia',
        'Breathable premium cotton blend',
        'Precision front & back custom graphics'
      ]
    },
    {
      id: 'mug',
      name: 'Custom Class Mug',
      desc: 'Start your day right with a premium ceramic mug. Perfect for coffee, tea, and late-night coding sessions.',
      price: 60,
      image: '/mug.jpeg',
      hasSizes: false,
      features: [
        'High-quality ceramic',
        'Microwave & dishwasher safe',
        'Vibrant wrap-around print'
      ]
    },
    {
      id: 'bag',
      name: 'Tech Legacy Tote Bag',
      desc: 'Carry your gear in style. Durable, spacious, and designed with the official class artwork.',
      price: 80,
      image: '/bag.jpeg',
      hasSizes: false,
      features: [
        'Heavy-duty canvas material',
        'Reinforced shoulder straps',
        'Spacious main compartment'
      ]
    }
  ];

  return (
    <section id="showcase" className="showcase-section">
      <div className="section-header-center" data-aos="fade-up">
        <span className="section-eyebrow">THE OFFICIAL MERCHANDISE</span>
        <h2 className="section-title-large">OUR EXCLUSIVE COLLECTION</h2>
        <p className="section-subtitle">Gear up for the journey ahead.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        {products.map((product, index) => (
          <div key={product.id} className="showcase-card" data-aos="zoom-in" data-aos-delay={index * 100}>
            <div className="showcase-grid" style={{ alignItems: 'center' }}>
              <div className="showcase-media">
                <div className="showcase-glow-bg"></div>
                <img
                  src={product.image}
                  alt={product.name}
                  className="showcase-svg-img"
                  style={{ objectFit: 'cover', borderRadius: '15px', width: '100%', height: 'auto', maxHeight: '400px' }}
                />
              </div>

              <div className="showcase-details">
                <div className="showcase-tag">{className} · {classYear}</div>
                <h3 className="showcase-name">{product.name}</h3>
                <p className="showcase-desc">{product.desc}</p>

                <div className="showcase-price-box">
                  <span className="unit-label">Price per item</span>
                  <span className="unit-price">GHS {product.price.toFixed(2)}</span>
                </div>

                {product.hasSizes && (
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
                )}

                <ul className="showcase-bullets">
                  {product.features.map((feature, i) => (
                    <li key={i}><FiCheck className="bullet-icon" /> {feature}</li>
                  ))}
                </ul>

                <button onClick={() => onOrderClick(product.id)} className="showcase-btn">
                  <FiShoppingBag /> ORDER NOW
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductShowcase;
