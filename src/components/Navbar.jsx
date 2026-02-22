import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

function Navbar({ currentPage, setCurrentPage, currentUser, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'tests', label: 'Tests' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' }
  ];

  // Add auth action depending on current user
  if (currentUser) {
    navItems.push({ id: 'logout', label: 'Logout' });
  } else {
    navItems.push({ id: 'login', label: 'Login' });
  }

  const handleNavClick = (pageId) => {
    if (pageId === 'logout') {
      if (typeof onLogout === 'function') onLogout();
      setCurrentPage('home');
      setIsMenuOpen(false);
      return;
    }
    setCurrentPage(pageId);
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <img src="/logo.png" alt="MindCare Logo" className="logo-image" />
        </div>
        
        <button 
          className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          {navItems.map(item => (
            <li key={item.id}>
              <button
                className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                data-page={item.id}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
