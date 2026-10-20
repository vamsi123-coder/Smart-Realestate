import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Brand */}
      <Link to="/" className="navbar-brand">
        <div className="navbar-logo">
          🏠 Smart<span>RE</span>
        </div>
      </Link>

      {/* Center Links */}
      <div className="navbar-links nav-links-desktop">
        <Link to="/" className={`nav-link ${isActive('/')}`}>Home</Link>
        <Link to="/search" className={`nav-link ${isActive('/search')}`}>Browse</Link>
        {isAuthenticated && (
          <Link to="/profile/list-property" className="btn btn-primary btn-sm">
            + List Property
          </Link>
        )}
      </div>

      {/* Right side */}
      <div className="navbar-links">
        {isAuthenticated ? (
          <div className="nav-dropdown">
            <div onClick={() => setDropdownOpen(!dropdownOpen)} style={{ cursor: 'pointer' }}>
              {currentUser?.profilePhoto ? (
                <img src={currentUser.profilePhoto} alt="avatar" className="nav-avatar" />
              ) : (
                <div className="nav-avatar-placeholder">{initials}</div>
              )}
            </div>
            <div className={`nav-dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
              <div style={{ padding: '10px 18px 6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {currentUser?.name}
              </div>
              <div className="nav-dropdown-divider" />
              <Link to="/profile" className="nav-dropdown-item">
                👤 My Profile
              </Link>
              <Link to="/profile?tab=listings" className="nav-dropdown-item">
                🏠 My Listings
              </Link>
              <Link to="/profile/list-property" className="nav-dropdown-item">
                ➕ Add Property
              </Link>
              <div className="nav-dropdown-divider" />
              <button onClick={handleLogout} className="nav-dropdown-item" style={{ color: 'var(--error)' }}>
                🚪 Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
}
