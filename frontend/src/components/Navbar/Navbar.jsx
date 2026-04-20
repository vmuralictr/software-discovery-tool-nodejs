import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import sdtLogo from '../../images/sdt-logo.png';
import './Navbar.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src={sdtLogo} alt="Software Discovery Tool" style={{ width: '300px', height: '83px', objectFit: 'contain' }} />
        </Link>

        <button
          className="hamburger"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        <ul className={`nav-links ${menuOpen ? 'nav-open' : ''}`}>
          <li>
            <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/faq" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              FAQ
            </NavLink>
          </li>
          <li>
            <a
              href="https://openmainframeproject.org"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-link"
              onClick={closeMenu}
            >
              Documentation
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
