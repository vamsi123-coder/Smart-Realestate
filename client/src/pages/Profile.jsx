import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Profile() {
  const { currentUser, updateCurrentUser, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'profile';

  const [editForm, setEditForm] = useState({ name: '', phone: '', profilePhoto: '' });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  const [myProperties, setMyProperties] = useState([]);
  const [propertiesLoading, setPropertiesLoading] = useState(false);

  useEffect(() => {
    document.title = 'My Profile – SmartRE';
    if (currentUser) {
      setEditForm({
        name: currentUser.name || '',
        phone: currentUser.phone || '',
        profilePhoto: currentUser.profilePhoto || '',
      });
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'listings') {
      fetchMyProperties();
    }
  }, [activeTab]);

  const fetchMyProperties = async () => {
    setPropertiesLoading(true);
    try {
      const res = await axios.get(`${API}/properties/me`);
      setMyProperties(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setPropertiesLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMsg('');
    setSaveError('');
    if (!editForm.name.trim()) { setSaveError('Name cannot be empty'); return; }
    setSaving(true);
    try {
      const res = await axios.put(`${API}/users/profile`, {
        name: editForm.name,
        phone: editForm.phone,
        profilePhoto: editForm.profilePhoto,
      });
      updateCurrentUser(res.data);
      setSaveMsg('✅ Profile updated successfully!');
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProperty = async (propId) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await axios.delete(`${API}/properties/${propId}`);
      setMyProperties(prev => prev.filter(p => p._id !== propId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete property');
    }
  };

  const initials = currentUser?.name
    ? currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  if (!currentUser) return (
    <div className="page-wrapper">
      <div className="loading-center" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      <div className="container profile-page">
        {/* Profile Header */}
        <div className="profile-header-card">
          <div className="profile-avatar-wrap">
            {currentUser.profilePhoto ? (
              <img src={currentUser.profilePhoto} alt={currentUser.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">{initials}</div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div className="profile-name">{currentUser.name}</div>
            <div className="profile-email">✉️ {currentUser.email}</div>
            {currentUser.phone ? (
              <div className="profile-phone-badge">📞 {currentUser.phone}</div>
            ) : (
              <div style={{ color: 'var(--warning)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚠️ Add your phone number to list properties
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
            <Link to="/profile/list-property" className="btn btn-primary btn-sm">
              ➕ List Property
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} className="btn btn-outline btn-sm">
              🚪 Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => navigate('/profile')}
          >
            👤 Edit Profile
          </button>
          <button
            className={`profile-tab ${activeTab === 'listings' ? 'active' : ''}`}
            onClick={() => navigate('/profile?tab=listings')}
          >
            🏠 My Listings
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="edit-card">
            <div className="edit-card-title">
              ✏️ Edit Profile
            </div>

            {saveMsg && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: 'var(--success)', fontSize: '0.9rem' }}>
                {saveMsg}
              </div>
            )}
            {saveError && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: 'var(--error)', fontSize: '0.9rem' }}>
                ⚠️ {saveError}
              </div>
            )}

            <form id="profile-edit-form" onSubmit={handleSave}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
                    id="profile-name"
                    type="text"
                    className="form-control"
                    placeholder="Your full name"
                    value={editForm.name}
                    onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                  />
                  <div className="form-error" style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
                    ℹ️ This name will appear on all your property listings
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number <span className="required">*</span></label>
                  <input
                    id="profile-phone"
                    type="tel"
                    className="form-control"
                    placeholder="10-digit mobile number"
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    maxLength={10}
                  />
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    ℹ️ Required for listing properties. Shown to interested buyers.
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={currentUser.email}
                  disabled
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Email cannot be changed</div>
              </div>

              <div className="form-group">
                <label className="form-label">Profile Photo URL</label>
                <input
                  id="profile-photo"
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/your-photo.jpg"
                  value={editForm.profilePhoto}
                  onChange={e => setEditForm({ ...editForm, profilePhoto: e.target.value })}
                />
                {editForm.profilePhoto && (
                  <img
                    src={editForm.profilePhoto}
                    alt="Preview"
                    style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginTop: '10px', border: '2px solid var(--border)' }}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button id="profile-save-btn" type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? '⏳ Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.2rem' }}>
                My Properties ({myProperties.length})
              </h2>
              <Link to="/profile/list-property" className="btn btn-primary btn-sm">
                ➕ Add New Listing
              </Link>
            </div>

            {propertiesLoading ? (
              <div className="loading-center">
                <div className="spinner" />
              </div>
            ) : myProperties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🏠</div>
                <div className="empty-state-title">No Listings Yet</div>
                <div className="empty-state-text">
                  Start listing your property for free and connect directly with buyers!
                </div>
                <Link to="/profile/list-property" className="btn btn-primary">List Your First Property</Link>
              </div>
            ) : (
              <div className="property-grid">
                {myProperties.map(property => (
                  <div key={property._id} style={{ position: 'relative' }}>
                    <PropertyCard property={property} />
                    {/* Action overlay */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0,
                      padding: '12px 16px',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      display: 'flex', gap: '8px',
                      borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                    }}>
                      <Link
                        to={`/profile/edit-property/${property._id}`}
                        className="btn btn-sm"
                        style={{ background: 'white', color: 'var(--accent)', flex: 1, justifyContent: 'center' }}
                        onClick={e => e.stopPropagation()}
                      >
                        ✏️ Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={e => { e.stopPropagation(); handleDeleteProperty(property._id); }}
                        style={{ flex: 1 }}
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
