import React, { useState, useEffect } from 'react';
import './DevisAdmin.css';

function DevisAdmin() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    nouveau: 0,
    en_cours: 0,
    traite: 0,
    ferme: 0
  });

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5000/api/devis/getAllDevis');
      const data = await response.json();

      if (data.success) {
        setDemandes(data.data);
        calculateStats(data.data);
      } else {
        setError(data.message || 'Erreur lors du chargement des devis');
      }
    } catch (err) {
      console.error('Erreur:', err);
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const stats = {
      total: data.length,
      nouveau: data.filter(d => d.statut === 'nouveau').length,
      en_cours: data.filter(d => d.statut === 'en_cours').length,
      traite: data.filter(d => d.statut === 'traite').length,
      ferme: data.filter(d => d.statut === 'ferme').length
    };
    setStats(stats);
  };

  const updateStatut = async (id, nouveauStatut) => {
    try {
      const response = await fetch(`http://localhost:5000/api/devis/${id}/statut`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: nouveauStatut })
      });
      const data = await response.json();
      if (data.success) {
        setDemandes(prev =>
          prev.map(d => (d.id === id ? { ...d, statut: nouveauStatut } : d))
        );
        if (selectedDemande?.id === id) {
          setSelectedDemande({ ...selectedDemande, statut: nouveauStatut });
        }
        calculateStats(demandes);
      } else {
        setError(data.message || 'Erreur lors de la mise à jour du statut');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la mise à jour');
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString('fr-FR');

  const getStatutClass = (statut) => ({
    nouveau: 'statut-nouveau',
    en_cours: 'statut-en-cours',
    traite: 'statut-traite',
    ferme: 'statut-ferme'
  }[statut] || '');

  const getStatutLabel = (statut) => ({
    nouveau: 'Nouveau',
    en_cours: 'En cours',
    traite: 'Traité',
    ferme: 'Fermé'
  }[statut] || statut);

  const getProduitLabel = (produit) => ({
    sac: 'Sac kraft personnalisé',
    boite: 'Boîte alimentaire',
    carton: 'Carton d\'expédition',
    autre: 'Autre'
  }[produit] || produit);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Administration des Devis</h1>
        <p>Gérez les demandes de devis reçues</p>
      </div>

      <div className="stats-container">
        <div className="stat-card"><h3>Total</h3><span>{stats.total}</span></div>
        <div className="stat-card nouveau"><h3>Nouveaux</h3><span>{stats.nouveau}</span></div>
        <div className="stat-card en-cours"><h3>En cours</h3><span>{stats.en_cours}</span></div>
        <div className="stat-card traite"><h3>Traités</h3><span>{stats.traite}</span></div>
        <div className="stat-card ferme"><h3>Fermés</h3><span>{stats.ferme}</span></div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        {loading ? (
          <div className="loading-spinner"><div className="spinner"></div><p>Chargement...</p></div>
        ) : (
          <table className="demandes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Nom</th>
                <th>Email</th>
                <th>Produit</th>
                <th>Quantité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map(d => (
                <tr key={d.id}>
                  <td>#{d.id}</td>
                  <td>{formatDate(d.date_creation)}</td>
                  <td>{d.nom}</td>
                  <td>{d.email}</td>
                  <td>{getProduitLabel(d.produit)}</td>
                  <td>{d.quantite}</td>
                  <td><span className={`statut-badge ${getStatutClass(d.statut)}`}>{getStatutLabel(d.statut)}</span></td>
                  <td><button onClick={() => { setSelectedDemande(d); setShowModal(true); }}>Détails</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedDemande && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Détails #{selectedDemande.id}</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div><strong>Nom:</strong> {selectedDemande.nom}</div>
                <div><strong>Email:</strong> {selectedDemande.email}</div>
                <div><strong>Téléphone:</strong> {selectedDemande.tel}</div>
                <div><strong>Entreprise:</strong> {selectedDemande.entreprise || 'Non spécifiée'}</div>
                <div><strong>Produit:</strong> {getProduitLabel(selectedDemande.produit)}</div>
                <div><strong>Quantité:</strong> {selectedDemande.quantite}</div>
                <div><strong>Date:</strong> {formatDate(selectedDemande.date_creation)}</div>
                <div>
                  <label>Statut:</label>
                  <select value={selectedDemande.statut} onChange={(e) => updateStatut(selectedDemande.id, e.target.value)}>
                    <option value="nouveau">Nouveau</option>
                    <option value="en_cours">En cours</option>
                    <option value="traite">Traité</option>
                    <option value="ferme">Fermé</option>
                  </select>
                </div>
              </div>
              {selectedDemande.message && (
                <div className="detail-message">
                  <label>Message:</label>
                  <p>{selectedDemande.message}</p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DevisAdmin;
