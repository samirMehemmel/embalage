import React, { useEffect, useState } from 'react';
import './Produit.css';

function Produits() {
  const [produits, setProduits] = useState([]);
  const [error, setError] = useState('');
  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetch(`${API_URL}/produits/getproduct`)
      .then(res => res.json())
      .then(data => {
        if (data.produits) {
          setProduits(data.produits);
        } else {
          setError('Erreur lors du chargement des produits.');
        }
      })
      .catch((err) => {
        console.error('Erreur API:', err);
        setError('Erreur serveur');
      });
  }, []);

  return (
    <div className="produits-page">
      <section className="produits-hero">
        <div className="hero-contentt">
          <h1>Notre Production</h1>
          <p>Des emballages sur mesure, adaptés à vos besoins professionnels.</p>
        </div>
        <img
          src="/assets/images/hero-produits.jpg"
          alt="Atelier de production"
          className="hero-image"
        />
      </section>

      <section className="produits-list">
        <h2>Nos types d’emballages</h2>

        {error && <p className="error">{error}</p>}

        <div className="produits-grid">
          {produits.map((item, index) => (
            <div className="produit-card" key={index}>
              <img
                src={`http://localhost:5000/uploads/${item.image}`}
                alt={item.nom}
              />
              <h3>{item.nom}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="capacites">
        <h2>Notre savoir-faire</h2>
        <ul>
          <li>📦 Production sur mesure (formats, quantités, matériaux)</li>
          <li>🖨️ Impression personnalisée : quadri, sérigraphie, marquage</li>
          <li>🌱 Matériaux recyclables et biodégradables disponibles</li>
          <li>🚚 Livraison dans toute l’Algérie sous 48h</li>
        </ul>
      </section>

      <section className="produits-cta">
        <h3>Besoin d’un emballage spécifique ?</h3>
        <a href="/obtenir-devis" className="cta-button">Demander un devis personnalisé</a>
      </section>
    </div>
  );
}

export default Produits;
