import React from 'react';
import './ProductsSection.css';

const products = [
  {
    title: 'Sacs Kraft',
    image: '/assets/images/sac_craft.png',
    desc: 'Emballage écologique et personnalisable.',
  },
  {
    title: 'Boîtes Alimentaires',
    image: '/assets/images/boite-alimentaire.png',
    desc: 'Idéales pour la restauration rapide.',
  },
  {
    title: 'Cartons Industriels',
    image: '/assets/images/carton.png',
    desc: 'Solutions robustes pour l’expédition.',
  },
];

function ProductsSection() {
  return (
    <section className="products-section">
      <h2>Nos Produits</h2>
      <div className="products-grid">
        {products.map((item, index) => (
          <div key={index} className="product-card">
            <img src={item.image} alt={item.title} />
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProductsSection;
