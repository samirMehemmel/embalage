import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import './LayoutAdmin.css';

function LayoutAdmin() {
  const adminEmail = localStorage.getItem('adminEmail');

  return (
    <div className="layout-admin">
      <aside className="admin-sidebar">
        <h2>Dashboard</h2>
        <nav>
          <NavLink to="/admin" end>🏠 Accueil</NavLink>
          <NavLink to="/admin/produits">📦 Produits</NavLink>
          <NavLink to="/admin/devis">📥 Devis</NavLink>
          <NavLink to="/admin/utilisateurs">👤 Admins</NavLink>

          {adminEmail === 'mehemmelsamir@gmail.com' && (
            <NavLink to="/admin/caisse">💰 Caisse</NavLink>
          )}

          <NavLink to="/admin/logout">🔓 Déconnexion</NavLink>
        </nav>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}

export default LayoutAdmin;
