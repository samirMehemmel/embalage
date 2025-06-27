import React, { useState } from 'react';
import './ObtenirDevis.css';

function ObtenirDevis() {
 
  

  return (
    <div className="devis-page">
      <section className="devis-hero">
        <h1>Demande de devis</h1>
        <p>Nous vous répondons rapidement avec une offre adaptée à vos besoins.</p>
      </section>

      <section className="devis-form-section">
        <div className="devis-form-container">
          <form className="devis-form">
            <label htmlFor="nom">Nom complet *</label>
            <input type="text" id="nom" name="nom" required />

            <label htmlFor="email">Adresse e-mail *</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="tel">Numéro de téléphone *</label>
            <input type="text" id="tel" name="tel" required />

            <label htmlFor="entreprise">Nom de l’entreprise</label>
            <input type="text" id="entreprise" name="entreprise" />

            <label htmlFor="produit">Type d’emballage souhaité *</label>
            <select id="produit" name="produit" required>
              <option value="">-- Sélectionnez --</option>
              <option value="sac">Sac kraft personnalisé</option>
              <option value="boite">Boîte alimentaire</option>
              <option value="carton">Carton d’expédition</option>
              <option value="autre">Autre</option>
            </select>

            <label htmlFor="quantite">Quantité estimée *</label>
            <input type="number" id="quantite" name="quantite" required />

            <label htmlFor="message">Détails supplémentaires</label>
            <textarea id="message" name="message" rows="5"></textarea>

            <button type="submit">Envoyer la demande</button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ObtenirDevis;
