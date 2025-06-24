import React from 'react';
import './Header.css';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-banner">
          <Link to ="/">
          <img src="/logo.jpeg" alt="Logo société" className="logo" /></Link>
        </div>
        <nav className="nav-banner">
          <ul className="navlist">
            <Link to="/" >Accueil</Link>
            <Link to="/a-propos">À propos</Link>
            <Link to="/Produits">Produits</Link>
            <Link to="/obtenir-devis">Devis</Link>
            <Link>Contact</Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
