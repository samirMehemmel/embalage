import React, { useEffect, useState, useMemo } from 'react';
import './AdminCaisse.css';

function AdminCaisse() {
  const [mouvements, setMouvements] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    montant: '',
    motif: '',
    id_type: '',
    type: 'revenu'
  });

  const fetchMouvements = async () => {
    try {
      setError('');
      const res = await fetch('http://localhost:5000/api/caisse');
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setMouvements(Array.isArray(data.caisse) ? data.caisse : []);
    } catch (error) {
      console.error('Erreur lors du chargement des mouvements:', error);
      setError('Impossible de charger les mouvements de caisse');
      setMouvements([]);
    }
  };

  const fetchTypes = async () => {
    try {
      setError('');
      const res = await fetch('http://localhost:5000/api/types');
      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setTypes(Array.isArray(data.types) ? data.types : []);
    } catch (error) {
      console.error('Erreur lors du chargement des types:', error);
      setError('Impossible de charger les catégories');
      setTypes([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMouvements(), fetchTypes()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
    // Effacer les erreurs quand l'utilisateur commence à taper
    if (error) setError('');
  };

  const validateForm = () => {
    if (!form.montant || parseFloat(form.montant) <= 0) {
      setError('Le montant doit être un nombre positif');
      return false;
    }
    if (!form.motif.trim()) {
      setError('Le motif est obligatoire');
      return false;
    }
    if (!form.id_type) {
      setError('Veuillez sélectionner une catégorie');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const id_admin = localStorage.getItem('admin_id');
    if (!id_admin) {
      setError("Admin non authentifié. Veuillez vous reconnecter.");
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const dataToSend = { 
        ...form, 
        id_admin,
        montant: parseFloat(form.montant)
      };

      const res = await fetch('http://localhost:5000/api/caisse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!res.ok) {
        throw new Error(`Erreur ${res.status}: ${res.statusText}`);
      }

      // Réinitialiser le formulaire
      setForm({ 
        montant: '', 
        motif: '', 
        id_type: '', 
        type: 'revenu' 
      });
      
      // Recharger les données
      await fetchMouvements();
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      setError('Erreur lors de l\'ajout du mouvement. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculs optimisés avec useMemo
  const { totalRevenu, totalDepense, solde } = useMemo(() => {
    if (!Array.isArray(mouvements)) {
      return { totalRevenu: 0, totalDepense: 0, solde: 0 };
    }
    
    const totals = mouvements.reduce((acc, m) => {
      const montant = parseFloat(m.montant) || 0;
      if (m.type === 'revenu') {
        acc.totalRevenu += montant;
      } else if (m.type === 'depense') {
        acc.totalDepense += montant;
      }
      return acc;
    }, { totalRevenu: 0, totalDepense: 0 });

    return {
      ...totals,
      solde: totals.totalRevenu - totals.totalDepense
    };
  }, [mouvements]);

  const formatMontant = (montant) => {
    return parseFloat(montant).toLocaleString('fr-DZ', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="caisse-page">
        <div className="loading">
          <p>Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="caisse-page">
      <h2>💰 Gestion de la Caisse</h2>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form-caisse">
        <select 
          name="type" 
          value={form.type} 
          onChange={handleChange} 
          required
          disabled={submitting}
        >
          <option value="revenu">Revenu</option>
          <option value="depense">Dépense</option>
        </select>

        <select 
          name="id_type" 
          value={form.id_type} 
          onChange={handleChange} 
          required
          disabled={submitting}
        >
          <option value="">-- Sélectionner une catégorie --</option>
          {types.map((t) => (
            <option key={t.id} value={t.id}>{t.libelle}</option>
          ))}
        </select>

        <input
          type="text"
          name="motif"
          placeholder="Motif (obligatoire)"
          value={form.motif}
          onChange={handleChange}
          required
          disabled={submitting}
          maxLength={255}
        />

        <input
          type="number"
          name="montant"
          placeholder="Montant (DA)"
          value={form.montant}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          disabled={submitting}
        />

        <button 
          type="submit" 
          disabled={submitting}
          className={submitting ? 'submitting' : ''}
        >
          {submitting ? 'Ajout en cours...' : 'Ajouter'}
        </button>
      </form>

      <div className="totaux">
        <div className="total-item revenu">
          <strong>✅ Total revenus :</strong> {formatMontant(totalRevenu)} DA
        </div>
        <div className="total-item depense">
          <strong>❌ Total dépenses :</strong> {formatMontant(totalDepense)} DA
        </div>
        <div className={`total-item solde ${solde >= 0 ? 'positif' : 'negatif'}`}>
          <strong>💰 Solde :</strong> {formatMontant(solde)} DA
        </div>
      </div>

      {mouvements.length === 0 ? (
        <div className="no-data">
          <p>Aucun mouvement de caisse enregistré.</p>
        </div>
      ) : (
        <div className="table-container">
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
                <tr key={m.id || index} className={m.type}>
                  <td>{new Date(m.date_heure).toLocaleDateString('fr-FR')}</td>
                  <td>{new Date(m.date_heure).toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}</td>
                  <td>
                    <span className={`type-badge ${m.type}`}>
                      {m.type === 'revenu' ? '✅' : '❌'} {m.type}
                    </span>
                  </td>
                  <td>{m.libelle_type || 'N/A'}</td>
                  <td className={`montant ${m.type}`}>
                    {formatMontant(m.montant)} DA
                  </td>
                  <td>{m.motif}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminCaisse;