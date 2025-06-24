import React from 'react';
import './Produit.css';

const produits = [
  {
    title: 'Sacs Kraft Personnalisés',
    image: '/assets/images/sac-kraft.png',
    description: 'Sacs résistants, écologiques et imprimés à votre image. Formats variés disponibles.',
  },
  {
    title: 'Boîtes Alimentaires',
    image: '/assets/images/boite-alimentaire.png',
    description: 'Idéales pour fast-food, pâtisserie ou livraison. Faciles à fermer et à transporter.',
  },
  {
    title: 'Cartons d\'Expédition',
    image: '/assets/images/carton.png',
    description: 'Cartons solides pour le transport ou l’emballage industriel. Personnalisables.',
  },
];

function Produits() {
  return (
    <div className="produits-page">
      {/* Hero Section */}
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

      {/* Liste des produits */}
      <section className="produits-list">
        <h2>Nos types d’emballages</h2>
        <div className="produits-grid">
          {produits.map((item, index) => (
            <div className="produit-card" key={index}>
              <img src={item.image} alt={item.title} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section technique */}
      <section className="capacites">
        <h2>Notre savoir-faire</h2>
        <ul>
          <li>📦 Production sur mesure (formats, quantités, matériaux)</li>
          <li>🖨️ Impression personnalisée : quadri, sérigraphie, marquage</li>
          <li>🌱 Matériaux recyclables et biodégradables disponibles</li>
          <li>🚚 Livraison dans toute l’Algérie sous 48h</li>
        </ul>
      </section>

      {/* Call to action */}
      <section className="produits-cta">
        <h3>Besoin d’un emballage spécifique ?</h3>
        <a href="/obtenir-devis" className="cta-button">Demander un devis personnalisé</a>
      </section>
    </div>
  );
}

export default Produits;
