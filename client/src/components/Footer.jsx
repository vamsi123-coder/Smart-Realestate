import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-name">🏠 SmartRE</div>
            <div className="footer-brand-text">
              India's first zero-brokerage real estate platform. Connect directly with property owners and buyers — no middlemen, no hidden fees.
            </div>
            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                📘
              </div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                🐦
              </div>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                📸
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="footer-col-title">Explore</div>
            <Link to="/search" className="footer-link">Browse Properties</Link>
            <Link to="/search?type=Flat" className="footer-link">Flats</Link>
            <Link to="/search?type=Villa" className="footer-link">Villas</Link>
            <Link to="/search?type=Land" className="footer-link">Land / Plots</Link>
            <Link to="/search?type=Commercial" className="footer-link">Commercial</Link>
          </div>

          {/* Account */}
          <div>
            <div className="footer-col-title">Account</div>
            <Link to="/signup" className="footer-link">Register Free</Link>
            <Link to="/login" className="footer-link">Sign In</Link>
            <Link to="/profile" className="footer-link">My Profile</Link>
            <Link to="/profile/list-property" className="footer-link">List Property</Link>
          </div>

          {/* Info */}
          <div>
            <div className="footer-col-title">About</div>
            <a href="#" className="footer-link">How It Works</a>
            <a href="#" className="footer-link">Zero Brokerage</a>
            <a href="#" className="footer-link">Contact Us</a>
            <a href="#" className="footer-link">Privacy Policy</a>
            <a href="#" className="footer-link">Terms of Use</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 SmartRE. All rights reserved.</span>
          <span>🇮🇳 Made in India with ❤️</span>
        </div>
      </div>
    </footer>
  );
}
