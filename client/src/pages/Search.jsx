import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import FilterPanel from '../components/FilterPanel';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultFilters = {
  keyword: '', type: '', minPrice: '', maxPrice: '',
  minArea: '', maxArea: '', bedrooms: '', city: '',
  state: '', furnished: '', sort: '',
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => ({
    ...defaultFilters,
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || '',
    city: searchParams.get('city') || '',
  }));
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.title = 'Browse Properties – SmartRE';
  }, []);

  const fetchProperties = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      // Remove empty params
      Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
      const res = await axios.get(`${API}/properties`, { params });
      setProperties(res.data.properties || []);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
      setCurrentPage(res.data.page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced fetch when filters change
  useEffect(() => {
    const t = setTimeout(() => fetchProperties(1), 400);
    return () => clearTimeout(t);
  }, [fetchProperties]);

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchProperties(page);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchParams({});
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Browse Properties
            </h1>
            {!loading && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
                {total.toLocaleString()} {total === 1 ? 'property' : 'properties'} found
              </p>
            )}
          </div>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀ Hide Filters' : '▶ Show Filters'}
          </button>
        </div>

        {/* Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: sidebarOpen ? '300px 1fr' : '1fr',
          gap: '28px',
          alignItems: 'start',
        }}>
          {/* Filter Panel */}
          {sidebarOpen && (
            <FilterPanel
              filters={filters}
              onChange={setFilters}
              onReset={handleReset}
            />
          )}

          {/* Results */}
          <div>
            {loading ? (
              <div className="loading-center">
                <div className="spinner" />
                <span>Searching properties...</span>
              </div>
            ) : properties.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <div className="empty-state-title">No Properties Found</div>
                <div className="empty-state-text">Try adjusting your filters or search query</div>
                <button className="btn btn-outline" onClick={handleReset}>Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className={`property-grid ${!sidebarOpen ? '' : ''}`}
                  style={!sidebarOpen ? { gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' } : {}}>
                  {properties.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ‹
                    </button>
                    {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
                      let page = i + 1;
                      if (pages > 7) {
                        if (currentPage <= 4) page = i + 1;
                        else if (currentPage >= pages - 3) page = pages - 6 + i;
                        else page = currentPage - 3 + i;
                      }
                      return (
                        <button
                          key={page}
                          className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      );
                    })}
                    <button
                      className="pagination-btn"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pages}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
