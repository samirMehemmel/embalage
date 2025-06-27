import React, { useState } from 'react';
import './UtilisateursAdmin.css';

function UtilisateursAdmin() {
  const [admins, setAdmins] = useState([
    {
      id: 1,
      nom: 'Samir Mehemmel',
      email: 'samir@example.com',
    },
    {
      id: 2,
      nom: 'mohammed G',
      email: 'Mohammed@example.com',
    },
  ]);

  const [formData, setFormData] = useState({
    nom: '',
    email: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAjouter = (e) => {
    e.preventDefault();
    if (formData.nom && formData.email) {
      const newAdmin = {
        id: Date.now(),
        ...formData,
      };
      setAdmins([newAdmin, ...admins]);
      setFormData({ nom: '', email: '' });
    }
  };

  const handleSupprimer = (id) => {
    setAdmins(admins.filter((admin) => admin.id !== id));
  };

  return (
    <div className="utilisateurs-admin">
      <h1>👤 Gestion des administrateurs</h1>

      <form onSubmit={handleAjouter} className="admin-form">
        <input
          type="text"
          name="nom"
          placeholder="Nom complet"
          value={formData.nom}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Ajouter</button>
      </form>

      <div className="admin-list">
        {admins.map((admin) => (
          <div key={admin.id} className="admin-card">
            <div>
              <h3>{admin.nom}</h3>
              <p>{admin.email}</p>
            </div>
            <button onClick={() => handleSupprimer(admin.id)}>Supprimer</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UtilisateursAdmin;
