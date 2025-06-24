import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation(); // Hook pour obtenir la route actuelle

  // Fonction pour vérifier si un lien est actif
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      {/* Ligne décorative animée */}
      <div className="header-line"></div>
      
      <div className="header-container">
        {/* Logo Section - Vous pouvez choisir entre les deux options */}
        <Link to="/" className="logo-banner">
          {/* Option 1: Votre logo existant */}
          <img src="/logo.jpeg" alt="Logo société" className="logo" />
          
          {/* Option 2: Logo moderne (commentez l'img ci-dessus et décommentez ci-dessous)
          <div className="logo-container">
            <span className="logo-text">S</span>
            <div className="logo-dot"></div>
          </div>
          <div className="brand-info">
            <h1>SacCraft</h1>
            <p>Emballage Premium</p>
          </div>
          */}
        </Link>

        {/* Navigation Desktop */}
        <nav className="nav-banner">
          <ul className="navlist">
            <li>
              <Link 
                to="/" 
                className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
              >
                Accueil
              </Link>
            </li>
            <li>
              <Link 
                to="/a-propos" 
                className={`nav-link ${isActiveLink('/a-propos') ? 'active' : ''}`}
              >
                À propos
              </Link>
            </li>
            <li>
              <Link 
                to="/Produits" 
                className={`nav-link ${isActiveLink('/Produits') ? 'active' : ''}`}
              >
                Produits
              </Link>
            </li>
            
            <li>
              <Link 
                to="/contact" 
                className={`nav-link ${isActiveLink('/contact') ? 'active' : ''}`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* CTA Button */}
        <Link to="/obtenir-devis" className="cta-button">
          Devis Gratuit
        </Link>

        {/* Menu Mobile Toggle */}
        <button 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Menu Mobile */}
      <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <Link 
              to="/" 
              onClick={toggleMobileMenu}
              className={isActiveLink('/') ? 'active' : ''}
            >
              Accueil
            </Link>
          </li>
          <li>
            <Link 
              to="/a-propos" 
              onClick={toggleMobileMenu}
              className={isActiveLink('/a-propos') ? 'active' : ''}
            >
              À propos
            </Link>
          </li>
          <li>
            <Link 
              to="/Produits" 
              onClick={toggleMobileMenu}
              className={isActiveLink('/Produits') ? 'active' : ''}
            >
              Produits
            </Link>
          </li>
          <li>
            <Link 
              to="/obtenir-devis" 
              onClick={toggleMobileMenu}
              className={isActiveLink('/obtenir-devis') ? 'active' : ''}
            >
                <span className='spn'>Devis</span>
              
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              onClick={toggleMobileMenu}
              className={isActiveLink('/contact') ? 'active' : ''}
            >
              Contact
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;