import React from 'react';
import './DevisSection.css';

function DevisSection() {
  return (
    <section className="devis-section">
      <div className="devis-container">
        <div className="devis-text">
          <h2>Demande de devis</h2>
          <p>
            Obtenez une estimation gratuite pour des solutions d’emballage personnalisées.
          </p>
          <a href="/obtenir-devis" className="devis-btn">Faire une demande</a>
          <p className="devis-contact">
            Vous pouvez aussi nous contacter directement au <strong>0552 49 20 36</strong>
          </p>
        </div>
        <div className="devis-image">
          <img src="/devissection.png" alt="Sac et boîte personnalisés" />
        </div>
      </div>
    </section>
  );
}

export default DevisSection;
