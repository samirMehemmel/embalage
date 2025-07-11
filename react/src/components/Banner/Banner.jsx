import React from 'react';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <h1>Des solutions d’emballage<br />sur mesure</h1>
          <p>Nous concevons et fabriquons des emballages adaptés à vos besoins industriels, alimentaires ou commerciaux.</p>
          <a href="/produits" className="hero-btn">Voir nos produits</a>
        </div>
        <div className="hero-image">
          <img src="/assets/images/emballage.png" alt="Emballage" />
        </div>
      </div>
    </section>
  );
}

export default Hero;
