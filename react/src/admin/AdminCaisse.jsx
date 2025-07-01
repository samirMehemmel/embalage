import React, { useEffect, useState } from 'react';
import './AdminCaisse.css';

function AdminCaisse() {
  const [mouvements, setMouvements] = useState([]);
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({
    montant: '',
    motif: '',
    id_type: '',
    type: 'revenu'
  });

  const fetchMouvements = async () => {
    const res = await fetch('http://localhost:5000/api/caisse');
    const data = await res.json();
    setMouvements(data.caisse);
  };

  const fetchTypes = async () => {
    const res = await fetch('http://localhost:5000/api/types');
    const data = await res.json();
    setTypes(data.types);
  };

  useEffect(() => {
    fetchMouvements();
    fetchTypes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const id_admin = localStorage.getItem('admin_id'); // ou autre clé
  if (!id_admin) {
    alert("Admin non authentifié");
    return;
  }

  const dataToSend = { ...form, id_admin };

  await fetch('http://localhost:5000/api/caisse', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToSend)
  });

  setForm({ montant: '', motif: '', id_type: '', type: 'revenu' });
  fetchMouvements();
};

 const totalRevenu = Array.isArray(mouvements)
  ? mouvements.filter(m => m.type === 'revenu').reduce((acc, m) => acc + parseFloat(m.montant), 0)
  : 0;

const totalDepense = Array.isArray(mouvements)
  ? mouvements.filter(m => m.type === 'depense').reduce((acc, m) => acc + parseFloat(m.montant), 0)
  : 0;

  return (
    <div className="caisse-page">
      <h2>💰 Gestion de la Caisse</h2>

      <form onSubmit={handleSubmit} className="form-caisse">
        <select name="type" value={form.type} onChange={handleChange} required>
          <option value="revenu">Revenu</option>
          <option value="depense">Dépense</option>
        </select>

        <select name="id_type" value={form.id_type} onChange={handleChange} required>
            <option value="">-- Catégorie --</option>
            {Array.isArray(types) && types.map((t) => (
                <option key={t.id} value={t.id}>{t.libelle}</option>
            ))}
        </select>


        <input
          type="text"
          name="motif"
          placeholder="Motif"
          value={form.motif}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="montant"
          placeholder="Montant"
          value={form.montant}
          onChange={handleChange}
          required
        />

        <button type="submit">Ajouter</button>
      </form>

      <div className="totaux">
        <p><strong>✅ Total revenus :</strong> {totalRevenu} DA</p>
        <p><strong>❌ Total dépenses :</strong> {totalDepense} DA</p>
      </div>

      <table className="table-caisse">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure</th>
            <th>Type</th>
            <th>Catégorie</th>
            <th>Montant</th>
            <th>Motif</th>
          </tr>
        </thead>
        <tbody>
          {mouvements.map((m, index) => (
            <tr key={index}>
              <td>{new Date(m.date_heure).toLocaleDateString()}</td>
              <td>{new Date(m.date_heure).toLocaleTimeString()}</td>
              <td>{m.type}</td>
              <td>{m.libelle_type}</td>
              <td>{m.montant} DA</td>
              <td>{m.motif}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCaisse;
