import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LayoutVitrine from '../layouts/LayoutVitrine';
import LayoutAdmin from '../layouts/LayoutAdmin';

import Home from '../pages/Home';
import Apropos from '../pages/Apropos';
import Produits from '../pages/Produit';
import Contact from '../pages/Contact';
import ObtenirDevis from '../pages/ObtenirDevis';

import AdminLogin from '../admin/AdminLogin';
import AdminDashboard from '../admin/AdminDashboard';
import DevisAdmin from '../admin/DevisAdmin';
import ProduitsAdmin from '../admin/ProduitsAdmin';
import UtilisateursAdmin from '../admin/UtilisateursAdmin';

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

      <Route element={<LayoutAdmin />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/devis" element={<DevisAdmin />} />
        <Route path="/admin/produits" element={<ProduitsAdmin />} />
        <Route path="/admin/utilisateurs" element={<UtilisateursAdmin />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
