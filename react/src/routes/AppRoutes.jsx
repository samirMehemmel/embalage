import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LayoutVitrine from '../layouts/LayoutVitrine';
import LayoutAdmin from '../layouts/LayoutAdmin';

import Home from '../pages/Home';
import Apropos from '../pages/Apropos';
import Produits from '../pages/Produit';
import Contact from '../pages/Contact';
import ObtenirDevis from '../pages/ObtenirDevis.jsx';

import AdminCaisse from '../admin/GestionCaisse';

import AdminLogin from '../admin/AdminLogin';
import AdminDashboard from '../admin/AdminDashboard';
import DevisAdmin from '../admin/DevisAdmin.jsx';
import ProduitsAdmin from '../admin/ProduitsAdmin';
import UtilisateursAdmin from '../admin/UtilisateursAdmin';
import LogoutAdmin from '../admin/LogoutAdmin';


function AppRoutes() {
  return (
    <Routes>
  <Route element={<LayoutVitrine />}>
    <Route path="/" element={<Home />} />
    <Route path="/a-propos" element={<Apropos />} />
    <Route path="/produits" element={<Produits />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/obtenir-devis" element={<ObtenirDevis />} /> 
  </Route>

  <Route path="/admin/login" element={<AdminLogin />} />

  <Route path="/admin" element={<LayoutAdmin />}>
    <Route index element={<AdminDashboard />} />
    <Route path="devis" element={<DevisAdmin />} />
    <Route path="produits" element={<ProduitsAdmin />} />
    <Route path="utilisateurs" element={<UtilisateursAdmin />} />
    <Route path="logout" element={<LogoutAdmin />} />
    <Route path="caisse" element={<AdminCaisse />} />
  </Route>
</Routes>

  );
}

export default AppRoutes;
