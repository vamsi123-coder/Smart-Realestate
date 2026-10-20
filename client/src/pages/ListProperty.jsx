import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AMENITIES_LIST = [
  'Parking', 'Garden', 'Gym', 'Swimming Pool', 'Security', 'Power Backup',
  'Lift', 'Club House', 'CCTV', 'Intercom', 'WiFi', 'Gas Pipeline',
];

const defaultForm = {
  title: '', description: '', type: 'Flat', price: '', area: '',
  bedrooms: '', bathrooms: '', furnished: 'NA', facing: 'NA',
  ageOfProperty: '', totalFloors: '', floorNumber: '', carParking: '',
  location: { address: '', city: '', state: '', pincode: '' },
  amenities: [], images: [],
};

export default function ListProperty() {
  const { id } = useParams(); // if editing
  const isEditing = Boolean(id);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(defaultForm);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // multi-step form
  const fileInputRef = useRef();

  useEffect(() => {
    document.title = isEditing ? 'Edit Listing – SmartRE' : 'List Property – SmartRE';

    if (!currentUser?.phone) {
      // User can still access but will see warning
    }

    if (isEditing) {
      axios.get(`${API}/properties/${id}`).then(res => {
        const p = res.data;
        setForm({
          ...p,
          price: p.price?.toString() || '',
          area: p.area?.toString() || '',
          bedrooms: p.bedrooms?.toString() || '',
          bathrooms: p.bathrooms?.toString() || '',
          ageOfProperty: p.ageOfProperty?.toString() || '',
          totalFloors: p.totalFloors?.toString() || '',
          floorNumber: p.floorNumber?.toString() || '',
          carParking: p.carParking?.toString() || '',
          amenities: p.amenities || [],
          images: p.images || [],
          location: p.location || defaultForm.location,
        });
      }).catch(() => navigate('/profile?tab=listings'));
    }
  }, [id, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, location: { ...prev.location, [name]: value } }));
  };

  const toggleAmenity = (amenity) => {
    setForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (form.images.length + files.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post(`${API}/properties/upload/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploaded.push(res.data.url);
      }
      setForm(prev => ({ ...prev, images: [...prev.images, ...uploaded] }));
    } catch (err) {
      setError('Image upload failed. Check Cloudinary configuration.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const validate = () => {
    if (!form.title.trim()) return 'Property title is required';
    if (!form.description.trim()) return 'Description is required';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) return 'Valid price is required';
    if (!form.area || isNaN(form.area) || Number(form.area) <= 0) return 'Valid area is required';
    if (!form.location.address.trim()) return 'Address is required';
    if (!form.location.city.trim()) return 'City is required';
    if (!form.location.state.trim()) return 'State is required';
    if (!form.location.pincode.trim()) return 'Pincode is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setError('');
    setSubmitting(true);

    const payload = {
      ...form,
      price: Number(form.price),
      area: Number(form.area),
      bedrooms: Number(form.bedrooms) || 0,
      bathrooms: Number(form.bathrooms) || 0,
      ageOfProperty: Number(form.ageOfProperty) || 0,
      totalFloors: Number(form.totalFloors) || 0,
      floorNumber: Number(form.floorNumber) || 0,
      carParking: Number(form.carParking) || 0,
    };

    try {
      if (isEditing) {
        await axios.put(`${API}/properties/${id}`, payload);
      } else {
        await axios.post(`${API}/properties`, payload);
      }
      navigate('/profile?tab=listings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Basic Info', 'Location', 'Details', 'Images & Amenities'];

  return (
    <div className="page-wrapper">
      <div className="container-md list-property-page">
        {/* Steps Indicator */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '32px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && <div style={{ flex: 1, height: 2, background: i < step ? 'var(--primary)' : 'var(--border)' }} />}
                <div
                  onClick={() => i < step && setStep(i + 1)}
                  style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: i + 1 <= step ? 'var(--primary)' : 'var(--border)',
                    color: i + 1 <= step ? 'white' : 'var(--text-muted)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem',
                    cursor: i < step ? 'pointer' : 'default',
                    flexShrink: 0, transition: 'all 0.3s'
                  }}
                >
                  {i + 1 < step ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 2, background: i + 1 < step ? 'var(--primary)' : 'var(--border)' }} />}
              </div>
              <div style={{ fontSize: '0.75rem', marginTop: '6px', color: i + 1 === step ? 'var(--primary)' : 'var(--text-muted)', fontWeight: i + 1 === step ? 700 : 500 }}>
                {s}
              </div>
            </div>
          ))}
        </div>

        <div className="list-property-card">
          {/* Header */}
          <div className="list-property-header">
            <h1 style={{ fontSize: '1.7rem', fontWeight: 800 }}>
              {isEditing ? '✏️ Edit Property Listing' : '🏠 List Your Property'}
            </h1>
            <p style={{ opacity: 0.8, marginTop: '8px', fontSize: '0.95rem' }}>
              {isEditing
                ? 'Update your property details below'
                : 'Fill in the details to list your property for free. Your contact info will be shown to buyers.'}
            </p>
            {currentUser && (
              <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '10px 16px', fontSize: '0.88rem', display: 'inline-flex', gap: '10px', alignItems: 'center' }}>
                <span>👤 {currentUser.name}</span>
                {currentUser.phone && <span>📞 {currentUser.phone}</span>}
              </div>
            )}
            {!currentUser?.phone && (
              <div style={{ marginTop: '12px', background: 'rgba(245,166,35,0.2)', borderRadius: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#fff' }}>
                ⚠️ Please <a href="/profile" style={{ color: 'white', textDecoration: 'underline' }}>add your phone number</a> in Profile before listing
              </div>
            )}
          </div>

          <form id="list-property-form" onSubmit={handleSubmit} className="list-property-form">
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', color: 'var(--error)', fontSize: '0.9rem' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <div>
                <div className="form-section-title">🏠 Basic Information</div>

                <div className="form-group">
                  <label className="form-label">Property Type <span className="required">*</span></label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                    {['Flat', 'Villa', 'Land', 'Commercial'].map(t => (
                      <div
                        key={t}
                        onClick={() => setForm(prev => ({ ...prev, type: t }))}
                        style={{
                          padding: '16px 12px', textAlign: 'center', borderRadius: 'var(--radius-md)',
                          border: `2px solid ${form.type === t ? 'var(--primary)' : 'var(--border)'}`,
                          background: form.type === t ? 'var(--primary-glow)' : 'white',
                          cursor: 'pointer', transition: 'all 0.2s',
                          color: form.type === t ? 'var(--primary)' : 'var(--text-secondary)',
                        }}
                      >
                        <div style={{ fontSize: '1.6rem', marginBottom: '6px' }}>
                          {t === 'Flat' ? '🏢' : t === 'Villa' ? '🏡' : t === 'Land' ? '🌳' : '🏪'}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{t}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Property Title <span className="required">*</span></label>
                  <input
                    id="prop-title"
                    name="title"
                    type="text"
                    className="form-control"
                    placeholder="e.g. 3BHK Spacious Flat with Garden View in Banjara Hills"
                    value={form.title}
                    onChange={handleChange}
                    maxLength={150}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description <span className="required">*</span></label>
                  <textarea
                    id="prop-description"
                    name="description"
                    className="form-control"
                    placeholder="Describe the property — neighborhood, unique features, condition, nearby landmarks..."
                    value={form.description}
                    onChange={handleChange}
                    rows={5}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Price (₹) <span className="required">*</span></label>
                    <input
                      id="prop-price"
                      name="price"
                      type="number"
                      className="form-control"
                      placeholder="e.g. 5000000"
                      value={form.price}
                      onChange={handleChange}
                      min={0}
                    />
                    {form.price && Number(form.price) > 0 && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--primary)', marginTop: '4px', fontWeight: 600 }}>
                        ≈ {Number(form.price) >= 10000000 ? `₹${(Number(form.price)/10000000).toFixed(2)} Cr` : `₹${(Number(form.price)/100000).toFixed(2)} L`}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Area (sq.ft.) <span className="required">*</span></label>
                    <input
                      id="prop-area"
                      name="area"
                      type="number"
                      className="form-control"
                      placeholder="e.g. 1200"
                      value={form.area}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location */}
            {step === 2 && (
              <div>
                <div className="form-section-title">📍 Location Details</div>

                <div className="form-group">
                  <label className="form-label">Full Address <span className="required">*</span></label>
                  <input
                    id="prop-address"
                    name="address"
                    type="text"
                    className="form-control"
                    placeholder="Street address, colony, society name..."
                    value={form.location.address}
                    onChange={handleLocationChange}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">City <span className="required">*</span></label>
                    <input
                      id="prop-city"
                      name="city"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Hyderabad"
                      value={form.location.city}
                      onChange={handleLocationChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State <span className="required">*</span></label>
                    <input
                      id="prop-state"
                      name="state"
                      type="text"
                      className="form-control"
                      placeholder="e.g. Telangana"
                      value={form.location.state}
                      onChange={handleLocationChange}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ maxWidth: '240px' }}>
                  <label className="form-label">Pincode <span className="required">*</span></label>
                  <input
                    id="prop-pincode"
                    name="pincode"
                    type="text"
                    className="form-control"
                    placeholder="e.g. 500034"
                    value={form.location.pincode}
                    onChange={handleLocationChange}
                    maxLength={6}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <div>
                <div className="form-section-title">📐 Property Details</div>

                {form.type !== 'Land' && (
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Bedrooms</label>
                      <select id="prop-bedrooms" name="bedrooms" className="form-control" value={form.bedrooms} onChange={handleChange}>
                        <option value="">Select</option>
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} BHK</option>)}
                        <option value="7">7+</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Bathrooms</label>
                      <select id="prop-bathrooms" name="bathrooms" className="form-control" value={form.bathrooms} onChange={handleChange}>
                        <option value="">Select</option>
                        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Furnishing</label>
                      <select id="prop-furnished" name="furnished" className="form-control" value={form.furnished} onChange={handleChange}>
                        <option value="NA">Not Applicable</option>
                        <option value="Furnished">Furnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Unfurnished">Unfurnished</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Facing</label>
                    <select id="prop-facing" name="facing" className="form-control" value={form.facing} onChange={handleChange}>
                      <option value="NA">Not Sure</option>
                      {['East','West','North','South','North-East','North-West','South-East','South-West'].map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Age of Property (years)</label>
                    <input
                      id="prop-age"
                      name="ageOfProperty"
                      type="number"
                      className="form-control"
                      placeholder="0 = New Construction"
                      value={form.ageOfProperty}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Car Parking</label>
                    <input
                      id="prop-parking"
                      name="carParking"
                      type="number"
                      className="form-control"
                      placeholder="No. of parking slots"
                      value={form.carParking}
                      onChange={handleChange}
                      min={0}
                    />
                  </div>
                </div>

                {form.type !== 'Land' && (
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Total Floors in Building</label>
                      <input
                        id="prop-total-floors"
                        name="totalFloors"
                        type="number"
                        className="form-control"
                        placeholder="e.g. 12"
                        value={form.totalFloors}
                        onChange={handleChange}
                        min={0}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Floor Number</label>
                      <input
                        id="prop-floor"
                        name="floorNumber"
                        type="number"
                        className="form-control"
                        placeholder="e.g. 5"
                        value={form.floorNumber}
                        onChange={handleChange}
                        min={0}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Images & Amenities */}
            {step === 4 && (
              <div>
                <div className="form-section-title">📸 Property Images</div>
                <div
                  className="image-upload-zone"
                  onClick={() => fileInputRef.current.click()}
                  onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }}
                  onDragLeave={e => e.currentTarget.classList.remove('drag-over')}
                  onDrop={e => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('drag-over');
                    const dataTransfer = { target: { files: e.dataTransfer.files } };
                    handleImageUpload(dataTransfer);
                  }}
                >
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">{uploading ? 'Uploading...' : 'Click or drag images here'}</div>
                  <div className="upload-subtext">Supports JPG, PNG, WebP. Max 5MB each. Max 10 images.</div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />

                {form.images.length > 0 && (
                  <div className="image-previews">
                    {form.images.map((url, i) => (
                      <div key={i} className="image-preview-item">
                        <img src={url} alt={`Property ${i+1}`} />
                        <button className="image-preview-remove" onClick={() => removeImage(i)}>✕</button>
                        {i === 0 && (
                          <div style={{ position: 'absolute', bottom: 4, left: 4, background: 'var(--primary)', color: 'white', fontSize: '0.68rem', padding: '2px 7px', borderRadius: '6px', fontWeight: 700 }}>
                            MAIN
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="form-section-title" style={{ marginTop: '36px' }}>✨ Amenities</div>
                <div className="amenities-check-grid">
                  {AMENITIES_LIST.map(amenity => (
                    <label
                      key={amenity}
                      className={`amenity-checkbox ${form.amenities.includes(amenity) ? 'checked' : ''}`}
                      onClick={() => toggleAmenity(amenity)}
                    >
                      <input type="checkbox" checked={form.amenities.includes(amenity)} readOnly />
                      <span>{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '36px', borderTop: '1px solid var(--border)', paddingTop: '28px' }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/profile?tab=listings')}
              >
                ← {step > 1 ? 'Previous' : 'Cancel'}
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (step === 1 && (!form.title || !form.price || !form.area)) {
                      setError('Please fill in title, price, and area');
                      return;
                    }
                    if (step === 2 && (!form.location.city || !form.location.state)) {
                      setError('Please fill in city and state');
                      return;
                    }
                    setError('');
                    setStep(s => s + 1);
                  }}
                >
                  Next →
                </button>
              ) : (
                <button
                  id="submit-property-btn"
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting || uploading}
                >
                  {submitting ? '⏳ Saving...' : isEditing ? '✅ Update Listing' : '🚀 Publish Listing'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
