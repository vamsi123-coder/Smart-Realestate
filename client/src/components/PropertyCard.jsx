import { useNavigate } from 'react-router-dom';

const formatPrice = (price) => {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price.toLocaleString('en-IN')}`;
};

const typeEmoji = { Flat: '🏢', Villa: '🏡', Land: '🌳', Commercial: '🏪' };

export default function PropertyCard({ property, onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick(property);
    else navigate(`/property/${property._id}`);
  };

  const mainImage = property.images?.[0];

  return (
    <div className="property-card animate-fade-in" onClick={handleClick}>
      {/* Image */}
      <div className="property-card-image">
        {mainImage ? (
          <img src={mainImage} alt={property.title} loading="lazy" />
        ) : (
          <div className="property-card-image-placeholder">
            {typeEmoji[property.type] || '🏠'}
          </div>
        )}
        <div className={`property-badge ${property.status === 'Sold' ? 'property-badge-sold' : ''}`}>
          {property.status === 'Sold' ? 'SOLD' : 'For Sale'}
        </div>
        <div className="property-type-chip">{property.type}</div>
      </div>

      {/* Body */}
      <div className="property-card-body">
        <div>
          <div className="property-price">
            {formatPrice(property.price)}
            <span className="property-price-sub"> total</span>
          </div>
          {property.area > 0 && (
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              ₹{Math.round(property.price / property.area).toLocaleString('en-IN')}/sq.ft
            </div>
          )}
        </div>

        <div className="property-title">{property.title}</div>

        <div className="property-location">
          <span>📍</span>
          <span>
            {property.location?.address ? `${property.location.address}, ` : ''}
            {property.location?.city}, {property.location?.state}
          </span>
        </div>

        <div className="property-specs">
          <div className="property-spec">
            <span>📐</span>
            <span>{property.area?.toLocaleString()} sq.ft</span>
          </div>
          {property.type !== 'Land' && (
            <>
              {property.bedrooms > 0 && (
                <div className="property-spec">
                  <span>🛏</span>
                  <span>{property.bedrooms} Bed</span>
                </div>
              )}
              {property.bathrooms > 0 && (
                <div className="property-spec">
                  <span>🚿</span>
                  <span>{property.bathrooms} Bath</span>
                </div>
              )}
            </>
          )}
          {property.furnished && property.furnished !== 'NA' && (
            <div className="property-spec">
              <span>🛋</span>
              <span>{property.furnished}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
