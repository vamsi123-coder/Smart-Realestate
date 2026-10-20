import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { register, googleLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Create Account – SmartRE';
    if (isAuthenticated) navigate('/profile');
  }, [isAuthenticated]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.trim()) return 'Email is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirm) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await googleLogin(idToken);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Illustration */}
      <div className="auth-illustration">
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🏡</div>
        <div className="auth-illustration-title">Start Your Journey</div>
        <div className="auth-illustration-text">
          Create your free SmartRE account and start buying or selling property with zero brokerage today.
        </div>
        <div style={{ marginTop: '40px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '16px',
            padding: '28px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '4px' }}>₹0</div>
            <div style={{ opacity: 0.8, fontSize: '0.9rem' }}>Brokerage on all listings</div>
            <div style={{ marginTop: '16px', fontSize: '0.88rem', opacity: 0.7, lineHeight: 1.7 }}>
              Connect directly with buyers and sellers. No agents. No commissions. Just real estate, simplified.
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="auth-form-container">
        <div className="auth-form-box">
          <h1 className="auth-form-title">Create Account</h1>
          <p className="auth-form-subtitle">Already have an account? <Link to="/login">Sign in</Link></p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: 'var(--error)', fontSize: '0.9rem' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Google */}
          <button id="google-signup-btn" className="btn-google" onClick={handleGoogle} disabled={googleLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
              <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/>
              <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
              <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
            </svg>
            {googleLoading ? 'Creating account...' : 'Continue with Google'}
          </button>

          <div className="auth-divider">or register with email</div>

          <form id="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                id="signup-name"
                name="name"
                type="text"
                className="form-control"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <input
                id="signup-email"
                name="email"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Password <span className="required">*</span></label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password <span className="required">*</span></label>
                <input
                  id="signup-confirm"
                  name="confirm"
                  type="password"
                  className="form-control"
                  placeholder="Repeat password"
                  value={form.confirm}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              By registering, you agree to our <a href="#" style={{ color: 'var(--primary)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--primary)' }}>Privacy Policy</a>.
            </div>
            <button id="signup-submit" type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? '⏳ Creating account...' : '🚀 Create Free Account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
