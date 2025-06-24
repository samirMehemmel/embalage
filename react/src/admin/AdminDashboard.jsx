import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <ul>
          <li><Link to="/admin/produits">📦 Gérer les produits</Link></li>
          <li><Link to="/admin/devis">📥 Devis reçus</Link></li>
          <li><Link to="/admin/utilisateurs">👤 Gestion des admins</Link></li>
        </ul>
      </aside>

      <main className="dashboard-content">
        <h1>Bienvenue dans le tableau de bord</h1>
        <p>Sélectionnez une section dans le menu pour commencer.</p>
      </main>
    </div>
  );
}

export default AdminDashboard;
