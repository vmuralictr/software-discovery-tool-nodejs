import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import omfLogo from '../images/openmainframe-logo.png';

const API_URL = process.env.REACT_APP_API_URL;

export default function SearchBar({ onResults, onSearchPerformed }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [totalResultsCount, setTotalResultsCount] = useState(0);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [osList, setOsList] = useState({});
  const [selectedOS, setSelectedOS] = useState({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchDescription, setSearchDescription] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/getSupportedDistros`)
      .then(r => r.json())
      .then(data => {
        setOsList(data);
        const initial = {};
        Object.keys(data).forEach(os => { initial[os] = false; });
        setSelectedOS(initial);
      })
      .catch(console.error);
  }, []);

  const generateSearchBitFlag = () => {
    let searchBitFlag = 0;
    Object.entries(selectedOS).forEach(([os, selected]) => {
      if (selected && osList[os]) {
        Object.values(osList[os]).forEach(bitValue => {
          searchBitFlag |= bitValue;
        });
      }
    });
    return searchBitFlag;
  };

  const doSearch = async (exact, pageNum = 0) => {
    const anySelected = Object.values(selectedOS).some(Boolean);
    if (!anySelected) {
      setError('No distribution selected');
      return;
    }
    setError('');
    setLoading(true);
    const bitFlag = generateSearchBitFlag();
    const term = encodeURIComponent(input.trim());
    try {
      const res = await fetch(
        `${API_URL}/searchPackages?search_term=${term}&exact_match=${exact}&search_bit_flag=${bitFlag}&page_number=${pageNum}`
      );
      const data = await res.json();
      setResults(data.packages || []);
      setTotalResultsCount(data.total_packages || 0);
      setSearchPerformed(true);
      onResults(data.packages || [], data.total_packages || 0, searchDescription, itemsPerPage, selectedOS, osList);
      onSearchPerformed();
    } catch (e) {
      setError('Search failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => doSearch(false, 0);
  const handleExact = () => doSearch(true, 0);
  const handleKeyDown = (e) => { if (e.key === 'Enter') handleSearch(); };

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    const updated = {};
    Object.keys(osList).forEach(os => { updated[os] = checked; });
    setSelectedOS(updated);
  };

  const handleOSToggle = (os, checked) => {
    const updated = { ...selectedOS, [os]: checked };
    setSelectedOS(updated);
    setSelectAll(Object.values(updated).every(Boolean));
  };

  const handleItemsPerPageChange = (val) => {
    setItemsPerPage(val);
    if (searchPerformed) {
      onResults(results, totalResultsCount, searchDescription, val, selectedOS, osList);
    }
  };

  const handleDescToggle = (checked) => {
    setSearchDescription(checked);
    if (searchPerformed) {
      onResults(results, totalResultsCount, checked, itemsPerPage, selectedOS, osList);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

      {/* OMF Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <img src={omfLogo} alt="Open Mainframe Project" style={{ width: '96px', height: '88px', objectFit: 'contain' }} />
        <p style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '20px', fontWeight: 700, color: '#000' }}>
          Search packages available on IBM Z Linux distributions
        </p>
      </div>

      {/* Search input */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search packages... (use * as wildcard)"
          style={{
            flex: 1,
            minWidth: '200px',
            border: '1px solid #cccccc',
            borderRadius: '20px',
            padding: '10px 20px',
            fontFamily: 'var(--font-family-poppins)',
            fontSize: '16px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            background: '#044FC0',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 24px',
            fontFamily: 'var(--font-family-poppins)',
            fontSize: '20px',
            fontWeight: 700,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          Search
        </button>
        <button
          onClick={handleExact}
          disabled={loading}
          style={{
            background: '#044FC0',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 24px',
            fontFamily: 'var(--font-family-poppins)',
            fontSize: '20px',
            fontWeight: 700,
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          Search Exact
        </button>
      </div>

      {error && (
        <p style={{ color: 'red', fontFamily: 'var(--font-family-poppins)', fontSize: '16px', marginBottom: '0.75rem' }}>
          {error}
        </p>
      )}

      {/* OS Checkboxes */}
      <div style={{
        border: '1px solid #dddddd',
        borderRadius: '8px',
        padding: '1rem 1.5rem',
        background: '#f5f5f5',
        marginBottom: '1rem',
      }}>
        {/* Select All */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid #cccccc' }}>
          <input
            type="checkbox"
            id="select-all"
            checked={selectAll}
            onChange={e => handleSelectAll(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="select-all" style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '20px', fontWeight: 700, cursor: 'pointer' }}>
            All
          </label>
        </div>

        {/* Individual OS checkboxes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem 2rem', justifyContent: 'center' }}>
          {Object.keys(osList).map(os => (
            <div key={os} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <input
                type="checkbox"
                id={`os-${os}`}
                checked={!!selectedOS[os]}
                onChange={e => handleOSToggle(os, e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <label htmlFor={`os-${os}`} style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
                {os}
              </label>
            </div>
          ))}
        </div>

        {/* Search Description checkbox */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #cccccc', justifyContent: 'center' }}>
          <input
            type="checkbox"
            id="show-desc"
            checked={searchDescription}
            onChange={e => handleDescToggle(e.target.checked)}
            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
          />
          <label htmlFor="show-desc" style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
            Search Description
          </label>
        </div>
      </div>

      {/* Bottom options row */}
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        {loading && <CircularProgress size={22} style={{ color: '#044FC0' }} />}

        {searchPerformed && totalResultsCount >= 5 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '16px', fontWeight: 700 }}>
              Records per page:
            </label>
            <select
              value={itemsPerPage}
              onChange={e => handleItemsPerPageChange(Number(e.target.value))}
              style={{ border: '1px solid #cccccc', borderRadius: '8px', padding: '4px 8px', fontFamily: 'var(--font-family-poppins)', fontSize: '15px' }}
            >
              {[5, 10, 20, 30, 40, 50].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        )}

        {searchPerformed && !loading && (
          <span style={{ fontFamily: 'var(--font-family-poppins)', fontSize: '20px', fontWeight: 700, marginLeft: 'auto' }}>
            {totalResultsCount} packages found
          </span>
        )}
      </div>
    </div>
  );
}
