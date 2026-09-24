import React from 'react';
import { Zap } from 'lucide-react';

export const AuthHero = () => {
  return (
    <div className="auth-hero-container exact-hero-spec">
      <div className="hero-content-centered">
        {/* Brand Header */}
        <div className="hero-brand-stacked">
          <div className="squircle-logo-box">
            <Zap size={28} color="white" fill="white" />
          </div>
          <span className="brand-title-stacked">ARMADA</span>
        </div>

        {/* Main Heading Tagline */}
        <div className="hero-text-centered">
          <h1 className="hero-heading-serif">
            Small habits, <br />
            <span className="purple-serif-text">big changes.</span>
          </h1>

          <div className="hero-short-divider"></div>

          <p className="hero-subtext-centered">
            Stay consistent, day by day, <br />
            and become your best self.
          </p>
        </div>
      </div>

      {/* Bottom Organic Waves & Sun Graphic Illustration */}
      <div className="hero-bottom-graphic">
        <div className="pastel-sun-rising"></div>
        <svg
          className="hero-waves-svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#e0e7ff"
            fillOpacity="0.75"
            d="M0,192L48,197.3C96,203,192,213,288,208C384,203,480,181,576,181.3C672,181,768,203,864,213.3C960,224,1056,224,1152,208C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill="#ede9fe"
            fillOpacity="0.85"
            d="M0,224L60,218.7C120,213,240,203,360,208C480,213,600,235,720,234.7C840,235,960,213,1080,202.7C1200,192,1320,192,1380,192L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          ></path>
          <path
            fill="#f3e8ff"
            fillOpacity="0.98"
            d="M0,256L80,245.3C160,235,320,213,480,224C640,235,800,277,960,277.3C1120,277,1280,235,1360,213.3L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};
