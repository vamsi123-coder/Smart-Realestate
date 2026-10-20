export default function FilterPanel({ filters, onChange, onReset }) {
  const types = ['Flat', 'Villa', 'Land', 'Commercial'];
  const bedOptions = ['1', '2', '3', '4+'];
  const furnishedOptions = ['Furnished', 'Semi-Furnished', 'Unfurnished'];

  const handleChip = (field, value) => {
    onChange({ ...filters, [field]: filters[field] === value ? '' : value });
  };

  return (
    <div className="filter-panel">
      <div className="filter-panel-title">
        <span>🔍 Filters</span>
        <button className="btn btn-ghost btn-sm" onClick={onReset} style={{ fontSize: '0.8rem' }}>
          Reset All
        </button>
      </div>

      {/* Keyword */}
      <div className="filter-group">
        <label className="filter-label">Search</label>
        <input
          type="text"
          placeholder="City, locality, keyword..."
          className="form-control form-control-sm"
          value={filters.keyword || ''}
          onChange={e => onChange({ ...filters, keyword: e.target.value })}
        />
      </div>

      {/* Property Type */}
      <div className="filter-group">
        <label className="filter-label">Property Type</label>
        <div className="filter-options">
          {types.map(t => (
            <button
              key={t}
              className={`filter-chip ${filters.type === t ? 'active' : ''}`}
              onClick={() => handleChip('type', t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label className="filter-label">Price Range (₹)</label>
        <div className="filter-range-inputs">
          <input
            type="number"
            placeholder="Min"
            className="form-control form-control-sm"
            value={filters.minPrice || ''}
            onChange={e => onChange({ ...filters, minPrice: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            className="form-control form-control-sm"
            value={filters.maxPrice || ''}
            onChange={e => onChange({ ...filters, maxPrice: e.target.value })}
          />
        </div>
        {/* Quick presets */}
        <div className="filter-options" style={{ marginTop: '10px' }}>
          {[
            { label: 'Under 30L', min: '', max: '3000000' },
            { label: '30L–1Cr', min: '3000000', max: '10000000' },
            { label: '1Cr+', min: '10000000', max: '' },
          ].map(p => (
            <button
              key={p.label}
              className={`filter-chip ${filters.minPrice === p.min && filters.maxPrice === p.max ? 'active' : ''}`}
              onClick={() => onChange({ ...filters, minPrice: p.min, maxPrice: p.max })}
              style={{ fontSize: '0.78rem' }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div className="filter-group">
        <label className="filter-label">Area (sq.ft.)</label>
        <div className="filter-range-inputs">
          <input
            type="number"
            placeholder="Min"
            className="form-control form-control-sm"
            value={filters.minArea || ''}
            onChange={e => onChange({ ...filters, minArea: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            className="form-control form-control-sm"
            value={filters.maxArea || ''}
            onChange={e => onChange({ ...filters, maxArea: e.target.value })}
          />
        </div>
      </div>

      {/* Bedrooms */}
      <div className="filter-group">
        <label className="filter-label">Bedrooms</label>
        <div className="filter-options">
          {bedOptions.map(b => (
            <button
              key={b}
              className={`filter-chip ${filters.bedrooms === b ? 'active' : ''}`}
              onClick={() => handleChip('bedrooms', b)}
            >
              {b} BHK
            </button>
          ))}
        </div>
      </div>

      {/* Furnished */}
      <div className="filter-group">
        <label className="filter-label">Furnishing</label>
        <div className="filter-options" style={{ flexDirection: 'column' }}>
          {furnishedOptions.map(f => (
            <button
              key={f}
              className={`filter-chip ${filters.furnished === f ? 'active' : ''}`}
              onClick={() => handleChip('furnished', f)}
              style={{ textAlign: 'left', borderRadius: '8px' }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* City */}
      <div className="filter-group">
        <label className="filter-label">City</label>
        <input
          type="text"
          placeholder="e.g. Hyderabad"
          className="form-control form-control-sm"
          value={filters.city || ''}
          onChange={e => onChange({ ...filters, city: e.target.value })}
        />
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <select
          className="form-control form-control-sm"
          value={filters.sort || ''}
          onChange={e => onChange({ ...filters, sort: e.target.value })}
        >
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="area_asc">Area: Small → Large</option>
          <option value="area_desc">Area: Large → Small</option>
        </select>
      </div>
    </div>
  );
}
