import { useState, useEffect, useMemo } from 'react';
import ReactPaginate from 'react-paginate';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function SearchResults({ results, totalCount, showDesc, itemsPerPage, selectedOS, osList }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [refineText, setRefineText] = useState('');
  const [filterDistro, setFilterDistro] = useState('All');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setCurrentPage(0);
  }, [results]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const selectedDistroNames = useMemo(() => {
    const names = ['All'];
    if (osList && selectedOS) {
      Object.entries(selectedOS).forEach(([os, sel]) => {
        if (sel && osList[os]) {
          Object.keys(osList[os]).forEach(d => names.push(d));
        }
      });
    }
    return names;
  }, [selectedOS, osList]);

  const filteredResults = useMemo(() => {
    return results.filter(([pkgName, desc, version, osName]) => {
      const matchText = refineText
        ? pkgName.toLowerCase().includes(refineText.toLowerCase()) ||
          version.toLowerCase().includes(refineText.toLowerCase())
        : true;
      const matchDistro = filterDistro === 'All' || osName === filterDistro;
      return matchText && matchDistro;
    });
  }, [results, refineText, filterDistro]);

  const pageCount = Math.ceil(filteredResults.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredResults.slice(offset, offset + itemsPerPage);

  if (!results || results.length === 0) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1.5rem 3rem' }}>

      {/* Refine filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '16px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            Refine package name/version:
          </label>
          <input
            type="text"
            value={refineText}
            onChange={e => { setRefineText(e.target.value); setCurrentPage(0); }}
            placeholder="Filter by name or version..."
            style={{
              width: '100%',
              border: '1px solid #cccccc',
              borderRadius: '15px',
              padding: '8px 16px',
              fontFamily: 'var(--font-family-poppins)',
              fontSize: '15px',
              outline: 'none',
            }}
          />
        </div>
        <div>
          <label style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '16px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            Distribution:
          </label>
          <select
            value={filterDistro}
            onChange={e => { setFilterDistro(e.target.value); setCurrentPage(0); }}
            style={{
              border: '1px solid #cccccc',
              borderRadius: '15px',
              padding: '8px 16px',
              fontFamily: 'var(--font-family-poppins)',
              fontSize: '15px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {selectedDistroNames.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Result cards */}
      <div>
        {currentItems.map(([pkgName, desc, version, osName]) => (
          <div
            key={`${pkgName}-${osName}`}
            style={{
              border: '1px solid #dddddd',
              borderRadius: '8px',
              padding: '16px',
              background: '#ffffff',
              marginBottom: '12px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '6px', alignItems: 'center' }}>
              <span style={{
                background: '#044FC0',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '4px 12px',
                fontSize: '14px',
                fontFamily: 'var(--font-family-poppins)',
                fontWeight: 700,
                display: 'inline-block',
              }}>
                v{version}
              </span>
              <span style={{
                background: '#f1f4ff',
                color: '#044FC0',
                borderRadius: '12px',
                padding: '4px 12px',
                fontSize: '13px',
                fontFamily: 'var(--font-family-poppins)',
                fontWeight: 700,
              }}>
                {osName}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '20px', fontWeight: 700, color: '#000000', margin: '4px 0' }}>
              {pkgName}
            </p>
            {showDesc && desc && (
              <p style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '20px', fontWeight: 400, color: '#666666', margin: '4px 0 0' }}>
                {desc}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem' }}>
          <ReactPaginate
            pageCount={pageCount}
            forcePage={currentPage}
            onPageChange={({ selected }) => { setCurrentPage(selected); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            previousLabel="‹"
            nextLabel="›"
            breakLabel="..."
            containerClassName="pagination-container"
            pageClassName="pagination-page"
            pageLinkClassName="pagination-link"
            activeClassName="pagination-active"
            previousClassName="pagination-prev"
            previousLinkClassName="pagination-link"
            nextClassName="pagination-next"
            nextLinkClassName="pagination-link"
            disabledClassName="pagination-disabled"
            breakLinkClassName="pagination-break"
          />
        </div>
      )}

      {/* Scroll to top */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#044FC0',
            color: '#ffffff',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(4,79,192,0.4)',
          }}
        >
          <ArrowUpwardIcon fontSize="small" />
        </button>
      )}
    </div>
  );
}
