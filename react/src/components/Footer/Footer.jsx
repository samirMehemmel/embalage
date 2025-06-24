import React from 'react';
import './Footer.css'; // ou utiliser Tailwind

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <img src="/assets/images/logo.png" alt="Logo" className="footer-logo" />
          <p>
            Société spécialisée dans la fabrication d'emballages en papier sur mesure.
          </p>
        </div>

        <div className="footer-col">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/a-propos">À propos</a></li>
            <li><a href="/produits">Produits</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <p>📞 0552 49 20 36</p>
          <p>✉️ contact@emballage.dz</p>
          <p>📍 Zone industrielle, Bordj Bou arréridj</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Emballage DZ. Tous droits réservés.</p>
        <p className="dev-note">Développé par Samir Mehemmel</p>
     </div>

    </footer>
  );
}

export default Footer;
