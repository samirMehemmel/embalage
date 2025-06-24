import React, { useState } from 'react';
import './AdminLogin.css';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔒 Remplacer ceci par une vérification via ton backend
    if (email === 'admin@example.com' && motDePasse === '123456') {
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setErreur("Email ou mot de passe incorrect.");
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
