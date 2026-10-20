import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const formatPrice = (price) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Crore`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} Lakh`;
  return `₹${price.toLocaleString('en-IN')}`;
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`${API}/properties/${id}`);
        setProperty(res.data);
        document.title = `${res.data.title} – SmartRE`;
      } catch (err) {
        if (err.response?.status === 404) navigate('/search');
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="page-wrapper">
      <div className="loading-center" style={{ minHeight: '60vh' }}>
        <div className="spinner" />
        <span>Loading property details...</span>
      </div>
    </div>
  );

  if (!property) return null;

  const isOwner = isAuthenticated && currentUser?._id === property.owner?._id;
  const amenityIcons = {
    'Parking': '🚗', 'Garden': '🌿', 'Gym': '💪', 'Swimming Pool': '🏊',
    'Security': '🔒', 'Power Backup': '⚡', 'Lift': '🛗', 'Club House': '🏛',
    'CCTV': '📷', 'Intercom': '📞', 'WiFi': '📶', 'Gas Pipeline': '🔧',
  };

  return (
    <div className="page-wrapper">
      {/* Breadcrumb */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '12px 5%' }}>
        <div style={{ display: 'flex', gap: '8px', fontSize: '0.84rem', color: 'var(--text-muted)', alignItems: 'center', maxWidth: '1280px', margin: '0 auto' }}>
          <Link to="/" style={{ color: 'var(--primary)' }}>Home</Link>
          <span>›</span>
          <Link to="/search" style={{ color: 'var(--primary)' }}>Properties</Link>
          <span>›</span>
          <span>{property.location.city}</span>
          <span>›</span>
          <span style={{ color: 'var(--text-primary)' }}>{property.title}</span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="container" style={{ marginTop: '28px' }}>
        {property.images?.length > 0 ? (
          <div>
            <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 460, background: '#f0f0f5' }}>
              <img
                src={property.images[activeImage]}
                alt={property.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: '8px'
              }}>
                {property.images.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: i === activeImage ? 28 : 10, height: 10,
                      borderRadius: 5, background: 'white',
                      opacity: i === activeImage ? 1 : 0.5,
                      cursor: 'pointer', transition: 'all 0.3s'
                    }}
                  />
                ))}
              </div>
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(i => Math.max(0, i - 1))}
                    style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.1rem' }}
                  >‹</button>
                  <button
                    onClick={() => setActiveImage(i => Math.min(property.images.length - 1, i + 1))}
                    style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', fontSize: '1.1rem' }}
                  >›</button>
                </>
              )}
            </div>
            {property.images.length > 1 && (
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                {property.images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: 80, height: 60, flexShrink: 0, borderRadius: '10px',
                      overflow: 'hidden', cursor: 'pointer',
                      border: `2.5px solid ${i === activeImage ? 'var(--primary)' : 'transparent'}`,
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div style={{
            height: 360, background: 'linear-gradient(135deg, #f5f0ff, #e8f0ff)',
            borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '5rem'
          }}>
            {property.type === 'Flat' ? '🏢' : property.type === 'Villa' ? '🏡' : property.type === 'Land' ? '🌳' : '🏪'}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container">
        <div className="property-detail-content">
          {/* Left Column */}
          <div className="property-detail-main">
            {/* Price + Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="property-detail-price">{formatPrice(property.price)}</span>
              <span style={{
                background: property.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(100,100,120,0.1)',
                color: property.status === 'Active' ? 'var(--success)' : 'var(--text-muted)',
                padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700
              }}>
                {property.status === 'Active' ? '✅ Available' : '❌ Sold'}
              </span>
              <span style={{ background: 'var(--accent-glow)', color: 'var(--accent)', padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700 }}>
                {property.type}
              </span>
            </div>
            {property.area > 0 && (
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                ₹{Math.round(property.price / property.area).toLocaleString('en-IN')} per sq.ft
              </div>
            )}

            <h1 className="property-detail-title">{property.title}</h1>
            <div className="property-detail-location">
              <span>📍</span>
              <span>
                {property.location.address}, {property.location.city}, {property.location.state} – {property.location.pincode}
              </span>
            </div>

            {/* Key Specs */}
            <div className="detail-specs-row">
              <div className="detail-spec-item">
                <div className="detail-spec-icon">📐</div>
                <div>
                  <div className="detail-spec-label">Area</div>
                  <div className="detail-spec-value">{property.area?.toLocaleString()} sq.ft</div>
                </div>
              </div>
              {property.type !== 'Land' && property.bedrooms > 0 && (
                <div className="detail-spec-item">
                  <div className="detail-spec-icon">🛏</div>
                  <div>
                    <div className="detail-spec-label">Bedrooms</div>
                    <div className="detail-spec-value">{property.bedrooms}</div>
                  </div>
                </div>
              )}
              {property.type !== 'Land' && property.bathrooms > 0 && (
                <div className="detail-spec-item">
                  <div className="detail-spec-icon">🚿</div>
                  <div>
                    <div className="detail-spec-label">Bathrooms</div>
                    <div className="detail-spec-value">{property.bathrooms}</div>
                  </div>
                </div>
              )}
              {property.furnished && property.furnished !== 'NA' && (
                <div className="detail-spec-item">
                  <div className="detail-spec-icon">🛋</div>
                  <div>
                    <div className="detail-spec-label">Furnishing</div>
                    <div className="detail-spec-value">{property.furnished}</div>
                  </div>
                </div>
              )}
              {property.carParking > 0 && (
                <div className="detail-spec-item">
                  <div className="detail-spec-icon">🚗</div>
                  <div>
                    <div className="detail-spec-label">Parking</div>
                    <div className="detail-spec-value">{property.carParking}</div>
                  </div>
                </div>
              )}
              {property.facing && property.facing !== 'NA' && (
                <div className="detail-spec-item">
                  <div className="detail-spec-icon">🧭</div>
                  <div>
                    <div className="detail-spec-label">Facing</div>
                    <div className="detail-spec-value">{property.facing}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '14px', marginBottom: '32px' }}>
              {[
                { label: 'Total Floors', value: property.totalFloors > 0 ? property.totalFloors : 'N/A', icon: '🏗' },
                { label: 'Floor No.', value: property.floorNumber > 0 ? property.floorNumber : 'N/A', icon: '🔢' },
                { label: 'Age of Property', value: property.ageOfProperty === 0 ? 'New Construction' : `${property.ageOfProperty} years`, icon: '📅' },
              ].map(({ label, value, icon }) => (
                <div key={label} style={{ background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', padding: '14px 16px', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '4px' }}>{icon} {label}</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{value}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="detail-section-title">📋 Description</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.95rem' }}>{property.description}</p>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <>
                <div className="detail-section-title">✨ Amenities</div>
                <div className="amenities-grid">
                  {property.amenities.map(a => (
                    <div key={a} className="amenity-chip">
                      <span>{amenityIcons[a] || '✓'}</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Posted Info */}
            <div style={{
              marginTop: '32px', background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)', padding: '16px 20px',
              fontSize: '0.84rem', color: 'var(--text-muted)',
              display: 'flex', gap: '20px', flexWrap: 'wrap'
            }}>
              <span>📅 Listed on {new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              <span>🆔 ID: {property._id.slice(-8).toUpperCase()}</span>
            </div>

            {/* Owner actions */}
            {isOwner && (
              <div style={{ marginTop: '28px', display: 'flex', gap: '12px' }}>
                <Link to={`/profile/edit-property/${property._id}`} className="btn btn-outline">
                  ✏️ Edit Listing
                </Link>
              </div>
            )}
          </div>

          {/* Right Column: Owner Card */}
          <div>
            <div className="owner-card">
              <div className="owner-card-header">
                {property.owner?.profilePhoto ? (
                  <img src={property.owner.profilePhoto} alt={property.ownerName} className="owner-card-avatar" />
                ) : (
                  <div className="owner-card-avatar-placeholder">
                    {property.ownerName?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <div className="owner-card-name">{property.ownerName}</div>
                <div className="owner-card-subtitle">Property Owner</div>
              </div>

              <div className="owner-card-body">
                {/* No Brokerage Badge */}
                <div className="owner-no-brokerage">
                  <span style={{ fontSize: '1.2rem' }}>🛡</span>
                  <div>
                    <div className="owner-no-brokerage-text">ZERO Brokerage</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>Direct owner contact — no middlemen</div>
                  </div>
                </div>

                {/* Call Button */}
                {isAuthenticated ? (
                  <>
                    {!phoneRevealed ? (
                      <button
                        id="reveal-phone-btn"
                        className="owner-contact-btn owner-contact-call"
                        onClick={() => setPhoneRevealed(true)}
                      >
                        📞 Show Contact Number
                      </button>
                    ) : (
                      <a
                        href={`tel:${property.ownerPhone}`}
                        className="owner-contact-btn owner-contact-call"
                        style={{ textDecoration: 'none' }}
                      >
                        📞 {property.ownerPhone}
                      </a>
                    )}
                    <a
                      href={`https://wa.me/91${property.ownerPhone}?text=Hi, I'm interested in your property: ${property.title} listed on SmartRE.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="owner-contact-btn owner-contact-whatsapp"
                      style={{ textDecoration: 'none' }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      WhatsApp Owner
                    </a>
                  </>
                ) : (
                  <Link
                    to="/login"
                    state={{ from: `/property/${property._id}` }}
                    className="owner-contact-btn owner-contact-call"
                    style={{ textDecoration: 'none' }}
                  >
                    🔐 Login to View Contact
                  </Link>
                )}

                <div style={{ marginTop: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.6 }}>
                  ⚠️ Never pay brokerage or token money without visiting the property
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
