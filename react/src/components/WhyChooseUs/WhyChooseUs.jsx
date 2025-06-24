import React from 'react';
import './WhyChooseUs.css';

const points = [
  {
    icon: '🛠️',
    title: 'Fabrication locale',
    desc: '100% made in Algérie dans nos propres ateliers.',
  },
  {
    icon: '🌱',
    title: 'Écologie & recyclage',
    desc: 'Nos emballages sont recyclables et respectueux de l’environnement.',
  },
  {
    icon: '🚚',
    title: 'Livraison rapide',
    desc: 'Partout en Algérie sous 48h.',
  },
];

function WhyChooseUs() {
  return (
    <section className="why-section">
      <h2>Pourquoi nous choisir ?</h2>
      <div className="why-grid">
        {points.map((item, index) => (
          <div key={index} className="why-card">
            <span className="why-icon">{item.icon}</span>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default WhyChooseUs;
