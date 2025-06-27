import React from 'react';
import './Apropos.css';

function Apropos() {

  return (
    <section className="apropos-page">
      <div className="apropos-hero">
        <div className="apropos-hero-content">
          <h1>À propos de notre entreprise</h1>
          <p>
            Emballage DZ, spécialiste de l’emballage sur mesure en Algérie.
          </p>
        </div>
        <img
          src="/assets/images/apropos-hero.jpg"
          alt="Atelier de fabrication"
          className="apropos-hero-image"
        />
      </div>

      {/* Présentation */}
      <div className="apropos-section">
        <h2>Notre histoire</h2>
        <p>
          Fondée en 2021, <strong>Emballage DZ</strong> est une entreprise familiale située à Alger,
          dédiée à la fabrication d’emballages personnalisés pour les professionnels de la
          restauration, de l’industrie et du commerce. Notre savoir-faire repose sur la qualité,
          l’écoute du client et la rapidité d’exécution.
        </p>
      </div>

      {/* Valeurs */}
      <div className="apropos-section valeurs">
        <h2>Nos valeurs</h2>
        <div className="valeurs-grid">
          <div className="valeur">
            <span>🌱</span>
            <h3>Écologie</h3>
            <p>Des matériaux recyclables pour un avenir durable.</p>
          </div>
          <div className="valeur">
            <span>🔒</span>
            <h3>Fiabilité</h3>
            <p>Des délais respectés et un service client réactif.</p>
          </div>
          <div className="valeur">
            <span>🚀</span>
            <h3>Innovation</h3>
            <p>Des solutions modernes adaptées aux nouveaux besoins.</p>
          </div>
        </div>
      </div>

      {/* Engagements */}
      <div className="apropos-section engagements">
        <h2>Nos engagements</h2>
        <ul>
          <li>✅ Livraison rapide dans toute l’Algérie</li>
          <li>✅ Produits de qualité constante</li>
          <li>✅ Accompagnement personnalisé pour chaque projet</li>
        </ul>
      </div>

      {/* Call to action */}
      <div className="apropos-cta">
        <h3>Vous avez un projet ?</h3>
        <a href="/obtenir-devis" className="cta-button">Demander un devis</a>
      </div>
    </section>
  );
}

export default Apropos;
