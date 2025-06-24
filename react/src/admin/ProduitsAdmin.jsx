import React, { useState } from 'react';
import './ProduitsAdmin.css';

function ProduitsAdmin() {
  const [produits, setProduits] = useState([
    {
      id: 1,
      nom: 'Sac kraft personnalisé',
      description: 'Sac écologique avec impression logo.',
      image: '/assets/images/sac-kraft.png',
    },
    {
      id: 2,
      nom: 'Boîte alimentaire',
      description: 'Boîte résistante pour pâtisserie ou fast-food.',
      image: '/assets/images/boite-alimentaire.png',
    },
  ]);

  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    image: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAjouter = (e) => {
    e.preventDefault();
    if (formData.nom && formData.description && formData.image) {
      const nouveauProduit = {
        id: Date.now(),
        ...formData,
      };
      setProduits([nouveauProduit, ...produits]);
      setFormData({ nom: '', description: '', image: '' });
    }
  };

  const handleSupprimer = (id) => {
    setProduits(produits.filter((p) => p.id !== id));
  };

  return (
    <div className="produits-admin">
      <h1>📦 Gérer les produits</h1>

      <form onSubmit={handleAjouter} className="produit-form">
        <input
          type="text"
          name="nom"
          placeholder="Nom du produit"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="image"
          placeholder="URL de l’image (/assets/images/xxx.png)"
          value={formData.image}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="produit-liste">
        {produits.map((produit) => (
          <div className="produit-card" key={produit.id}>
            <img src={produit.image} alt={produit.nom} />
            <div className="info">
              <h3>{produit.nom}</h3>
              <p>{produit.description}</p>
              <button onClick={() => handleSupprimer(produit.id)}>Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProduitsAdmin;
