import React, { useEffect } from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


function AdminDashboard() {
    const navigate = useNavigate(); // ✅ définir navigate ici

  useEffect(() => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    navigate('/admin/login');
  }
}, []);

  return (
    <div className="admin-dashboard">
     

      <main className="dashboard-content">
        <h1>Bienvenue dans le tableau de bord</h1>
        <p>Sélectionnez une section dans le menu pour commencer.</p>
      </main>
    </div>
  );
}

export default AdminDashboard;
