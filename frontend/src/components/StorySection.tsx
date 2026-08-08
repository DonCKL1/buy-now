import React from 'react';
import { FiHeart, FiUsers, FiClock, FiStar } from 'react-icons/fi';

interface StorySectionProps {
  className?: string;
  classYear?: string;
}

const StorySection: React.FC<StorySectionProps> = ({
  className = 'CKL TECH',
  classYear = '2026',
}) => {
  return (
    <section id="story" className="story-section">
      <div className="story-container">
        <div className="story-grid">
          {/* Left Text Column */}
          <div className="story-content" data-aos="fade-right">
            <span className="section-eyebrow">OUR CLASS STORY</span>
            <h2 className="section-title-large">MADE FOR THE MOMENT</h2>

            <p className="story-paragraph">
              Your final year is so much more than just the last semester of lectures and exams.
            </p>

            <p className="story-paragraph highlight">
              It is the late nights in the lab, group projects, intense presentations, endless laughs,
              unshakable friendships, and every challenge that brought us here together.
            </p>

            <p className="story-paragraph">
              This T-shirt is designed to give us something tangible to wear with pride,
              remember our hard-earned achievements, and keep long after graduation day.
            </p>

            <div className="story-stats-row">
              <div className="story-stat">
                <FiUsers className="stat-icon" />
                <div className="stat-num">{className}</div>
                <div className="stat-text">United Cohort</div>
              </div>
              <div className="story-stat">
                <FiClock className="stat-icon" />
                <div className="stat-num">Class of {classYear}</div>
                <div className="stat-text">Final Milestone</div>
              </div>
              <div className="story-stat">
                <FiHeart className="stat-icon" />
                <div className="stat-num">1 Memory</div>
                <div className="stat-text">Lifetime Bond</div>
              </div>
            </div>
          </div>

          {/* Right Image Banner Column */}
          <div className="story-media" data-aos="fade-left" data-aos-delay="150">
            <div className="story-image-card">
              <img
                src="/class.jpg"
                alt="Final Year Graduating Class"
                className="story-img"
              />
              <div className="story-card-overlay">
                <div className="overlay-badge">
                  <FiStar className="star-icon" />
                  <span>Commemorative Class Collection</span>
                </div>
                <p className="overlay-caption">
                  "Wearing our story, celebrating our technology journey."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
