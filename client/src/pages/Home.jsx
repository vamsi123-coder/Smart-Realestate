import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const featureCards = [
  { icon: '🚫', title: 'Zero Brokerage', desc: 'Connect directly with owners. No middlemen, no commission fees.' },
  { icon: '🔍', title: 'Smart Search', desc: 'Advanced filters to find exactly what you need in seconds.' },
  { icon: '🏠', title: 'List for Free', desc: 'Sellers list their property for free with all details and photos.' },
  { icon: '📞', title: 'Direct Contact', desc: 'Get owner contact directly on the listing. Simple and transparent.' },
];

const cities = ['Hyderabad', 'Bengaluru', 'Mumbai', 'Chennai', 'Delhi', 'Pune'];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ total: 0 });
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    document.title = 'SmartRE – Zero Brokerage Real Estate';
    const fetchFeatured = async () => {
      try {
        const res = await axios.get(`${API}/properties?limit=6`);
        setFeatured(res.data.properties || []);
        setStats({ total: res.data.total || 0 });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  return (
    <div className="page-wrapper">
      {/* No Brokerage Strip */}
      <div className="no-brokerage-strip">
        🎉 <span>100% FREE</span> No Brokerage — Direct Owner Contact on Every Listing <span>ZERO COMMISSION</span>
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="container" style={{ width: '100%' }}>
          <div className="hero-content">
            <div className="hero-badge">
              🏆 India's #1 Zero-Brokerage Platform
            </div>
            <h1 className="hero-title">
              Find Your Dream <span className="highlight">Property</span><br />
              Without Any Brokerage
            </h1>
            <p className="hero-subtitle">
              Browse thousands of verified properties — flats, villas, plots, and commercial spaces. List yours for free. Connect directly with owners.
            </p>

            {/* Search Bar */}
            <form className="search-hero-bar" onSubmit={handleSearch}>
              <span style={{ fontSize: '1.2rem' }}>🔍</span>
              <input
                id="hero-search"
                type="text"
                placeholder="Search by city, locality, property type..."
                className="search-hero-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Search</button>
            </form>

            {/* City Quick Picks */}
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {cities.map(city => (
                <button
                  key={city}
                  className="filter-chip"
                  onClick={() => navigate(`/search?city=${city}`)}
                  style={{ fontSize: '0.82rem' }}
                >
                  📍 {city}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">{stats.total > 0 ? stats.total.toLocaleString() : '1000+'}​</div>
                <div className="hero-stat-label">Properties Listed</div>
              </div>
              <div>
                <div className="hero-stat-value">₹0</div>
                <div className="hero-stat-label">Brokerage</div>
              </div>
              <div>
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">Happy Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 className="section-title">Why Choose SmartRE?</h2>
            <p className="section-subtitle">The smartest way to buy or sell property in India</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '28px' }}>
            {featureCards.map((f, i) => (
              <div
                key={i}
                className="animate-fade-in"
                style={{
                  background: 'var(--bg-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '36px 28px',
                  textAlign: 'center',
                  border: '1.5px solid var(--border)',
                  transition: 'var(--transition-slow)',
                  animationDelay: `${i * 0.1}s`
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.style.borderColor = '';
                }}
              >
                <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px', color: 'var(--text-primary)' }}>{f.title}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by Type */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">Browse by Property Type</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { type: 'Flat', emoji: '🏢', desc: 'Apartments & Condos', color: '#e8f0ff' },
              { type: 'Villa', emoji: '🏡', desc: 'Independent Houses', color: '#fff0e8' },
              { type: 'Land', emoji: '🌳', desc: 'Open Plots & Farms', color: '#e8fff0' },
              { type: 'Commercial', emoji: '🏪', desc: 'Shops & Offices', color: '#fff8e8' },
            ].map(({ type, emoji, desc, color }) => (
              <div
                key={type}
                onClick={() => navigate(`/search?type=${type}`)}
                style={{
                  background: color,
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'var(--transition-slow)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{emoji}</div>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{type}</div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '4px' }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Latest Listings</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>Fresh properties added by owners — contact them directly</p>
            </div>
            <Link to="/search" className="btn btn-outline">View All →</Link>
          </div>

          {loading ? (
            <div className="loading-center">
              <div className="spinner" />
              <span>Loading properties...</span>
            </div>
          ) : featured.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏠</div>
              <div className="empty-state-title">No Properties Yet</div>
              <div className="empty-state-text">Be the first to list a property!</div>
              {isAuthenticated ? (
                <Link to="/profile/list-property" className="btn btn-primary">List Your Property</Link>
              ) : (
                <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
              )}
            </div>
          ) : (
            <div className="property-grid">
              {featured.map(p => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="section">
          <div className="container">
            <div style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--primary) 100%)',
              borderRadius: 'var(--radius-xl)',
              padding: '80px 60px',
              textAlign: 'center',
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '16px' }}>
                  Ready to Find Your Dream Home?
                </h2>
                <p style={{ fontSize: '1.1rem', opacity: 0.85, marginBottom: '36px' }}>
                  Join thousands of buyers and sellers on SmartRE. 100% free. Zero brokerage.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/signup" className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
                    🚀 Get Started Free
                  </Link>
                  <Link to="/search" className="btn btn-lg btn-outline" style={{ borderColor: 'rgba(255,255,255,0.5)', color: 'white' }}>
                    Browse Properties
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
