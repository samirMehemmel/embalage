import React, { useEffect, useState } from 'react';
import './ProduitsAdmin.css';

function ProduitsAdmin() {
  const [produits, setProduits] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    type: '',
    mesures: '',
    description: '',
    image: '',
    prix: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = 'http://localhost:5000/api'; // remplace par ton URL si en prod

  // Charger les produits
 useEffect(() => {
  fetch(`${API_URL}/produits/getproduct`)
    .then(res => res.json())
    .then(data => {   // 🔍 Juste les produits
      setProduits(data.produits);
    })
    .catch(err => {
      console.error('❌ Erreur fetch produits:', err);
      setError('Erreur de chargement des produits');
    });
}, []);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAjouter = async (e) => {
  e.preventDefault();

  const formDataToSend = new FormData();
  formDataToSend.append('nom', formData.nom);
  formDataToSend.append('type', formData.type);
  formDataToSend.append('mesures', formData.mesures);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('prix', formData.prix);
  formDataToSend.append('image', formData.imageFile); // fichier

  try {
    const response = await fetch(`${API_URL}/produits/addproduct`, {
      method: 'POST',
      body: formDataToSend
    });

    const data = await response.json();
    if (response.ok) {
      setSuccess(data.message);
      setError('');
    } else {
      setError(data.error);
    }
  } catch (err) {
    console.error('Erreur upload:', err);
    setError('Erreur serveur');
  }
};


  const handleSupprimer = async (id) => {
  try {
    const response = await fetch(`${API_URL}/produits/delete/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();

    if (response.ok) {
      setProduits(produits.filter(p => p.id !== id));
      setSuccess(data.message);
      setError('');
    } else {
      setError(data.error || 'Erreur lors de la suppression');
    }
  } catch (err) {
    console.error('Erreur suppression:', err);
    setError('Erreur serveur');
  }
};


  return (
    <div className="produits-admin">
      <h1>📦 Gérer les produits</h1>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleAjouter} className="produit-form">
        <input type="text" name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} required />
        <input type="text" name="type" placeholder="Type" value={formData.type} onChange={handleChange} required />
        <input type="text" name="mesures" placeholder="Mesures" value={formData.mesures} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={formData.description} onChange={handleChange} required />
      

        
        <input type="number" name="prix" placeholder="Prix" value={formData.prix} onChange={handleChange} required />
        <label className="input-file">
          📁 Choisir une image
          <input
            type="file"
            name="image"
            accept="image/*"
            required
            onChange={(e) =>
              setFormData({ ...formData, imageFile: e.target.files[0] })
            }
          />
        </label>
        <button type="submit">Ajouter</button>
      </form>

      <div className="produit-liste">
        {produits.map((produit) => (
          <div className="produit-card" key={produit.id}>
            <img src={`http://localhost:5000/uploads/${produit.image}`} alt={produit.nom} />
            <div className="info">
              <h3>{produit.nom}</h3>
              <p>{produit.description}</p>
              <button onClick={() => handleSupprimer(produit.id)}>🗑️ Supprimer</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProduitsAdmin;
