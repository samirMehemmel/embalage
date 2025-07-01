import React, { useState } from 'react';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, mot_de_passe: motDePasse })
      });

      const data = await response.json();

      if (response.ok) {
        // Stocker le token dans le localStorage
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminId', data.admin.id);
        localStorage.setItem('adminEmail', data.admin.email);

        // Redirection vers dashboard admin
        navigate('/admin');
      } else {
        setErreur(data.error || 'Échec de connexion');
      }

    } catch (err) {
      console.error('Erreur de connexion :', err);
      setErreur("Erreur réseau ou serveur.");
    }
  };

  return (
    <div className="admin-login">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Connexion Admin</h2>
        {erreur && <p className="erreur">{erreur}</p>}
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}

export default AdminLogin;
