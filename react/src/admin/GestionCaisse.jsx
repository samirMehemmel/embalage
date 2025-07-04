import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, TrendingUp, TrendingDown, DollarSign, Calendar, Edit, Trash2 } from 'lucide-react';

const API_BASE = 'http://localhost:5000/api/caisse';

const GestionCaisse = () => {
  const [transactions, setTransactions] = useState([]);
  const [typesTransaction, setTypesTransaction] = useState([]);
  const [statistiques, setStatistiques] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [showTypesPanel, setShowTypesPanel] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');


  const [filtres, setFiltres] = useState({
    type_operation: '',
    type_transaction_id: '',
    date_debut: '',
    date_fin: '',
    montant_min: '',
    montant_max: ''
  });

  const [formData, setFormData] = useState({
    type_operation: '',
    type_transaction_id: '',
    montant: '',
    motif: '',
    date_transaction: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    chargerTypesTransaction();
    chargerTransactions();
    chargerStatistiques();
  }, []);

  useEffect(() => {
    chargerTransactions();
  }, [filtres]);

  const chargerTypesTransaction = async () => {
    try {
      const response = await fetch(`${API_BASE}/types`);
      const data = await response.json();
      setTypesTransaction(data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des types:', error);
    }
  };

  const chargerTransactions = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filtres).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`${API_BASE}/transactions?${params}`);
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const chargerStatistiques = async () => {
    try {
      const response = await fetch(`${API_BASE}/statistiques`);
      const data = await response.json();
      setStatistiques(data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editingTransaction 
        ? `${API_BASE}/transactions/${editingTransaction.id}`
        : `${API_BASE}/transactions`;
      const method = editingTransaction ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setShowForm(false);
        setEditingTransaction(null);
        resetFormData();
        chargerTransactions();
        chargerStatistiques();
      } else {
        const error = await response.json();
        alert(error.error || 'Erreur lors de la sauvegarde');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setFormData({
      type_operation: transaction.type_operation,
      type_transaction_id: transaction.type_transaction_id || '',
      montant: transaction.montant,
      motif: transaction.motif,
      date_transaction: transaction.date_transaction
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        const response = await fetch(`${API_BASE}/transactions/${id}`, { method: 'DELETE' });
        if (response.ok) {
          chargerTransactions();
          chargerStatistiques();
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const resetFormData = () => {
    setFormData({
      type_operation: '',
      type_transaction_id: '',
      montant: '',
      motif: '',
      date_transaction: new Date().toISOString().split('T')[0]
    });
  };

  const resetFiltres = () => {
    setFiltres({
      type_operation: '',
      type_transaction_id: '',
      date_debut: '',
      date_fin: '',
      montant_min: '',
      montant_max: ''
    });
  };

 const formatMontant = (montant) => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'currency',
    currency: 'DZD'
  }).format(montant);
};


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const calculerTotalFiltré = () => {
  const totalRecette = transactions
    .filter(t => t.type_operation === 'recette')
    .reduce((acc, curr) => acc + parseFloat(curr.montant), 0);

  const totalDepense = transactions
    .filter(t => t.type_operation === 'depense')
    .reduce((acc, curr) => acc + parseFloat(curr.montant), 0);

  const solde = totalRecette - totalDepense;

  return {
    totalRecette,
    totalDepense,
    solde
  };
};


  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '30px',
        borderRadius: '15px',
        marginBottom: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          margin: '0 0 20px 0', 
          fontSize: '2.5em', 
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          💰 Gestion de Caisse
        </h1>
        
        {statistiques && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '20px',
            marginTop: '20px'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '20px', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <TrendingUp size={24} style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                {formatMontant(statistiques.solde.total_recettes || 0)}
              </div>
              <div style={{ fontSize: '0.9em', opacity: '0.8' }}>Total Recettes</div>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '20px', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <TrendingDown size={24} style={{ marginBottom: '10px' }} />
              <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                {formatMontant(statistiques.solde.total_depenses || 0)}
              </div>
              <div style={{ fontSize: '0.9em', opacity: '0.8' }}>Total Dépenses</div>
            </div>
            
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '20px', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <DollarSign size={24} style={{ marginBottom: '10px' }} />
              <div style={{ 
                fontSize: '1.2em', 
                fontWeight: 'bold',
                color: (statistiques.solde.solde_net || 0) >= 0 ? '#4ade80' : '#f87171'
              }}>
                {formatMontant(statistiques.solde.solde_net || 0)}
              </div>
              <div style={{ fontSize: '0.9em', opacity: '0.8' }}>Solde Net</div>
            </div>
          </div>
        )}
      </div>

      {/* Barre d'actions */}
      <div style={{ 
  background: 'white', 
  padding: '20px', 
  borderRadius: '10px', 
  marginBottom: '20px',
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  display: 'flex',
  gap: '10px'
}}>
  <button
    onClick={() => setShowForm(!showForm)}
    style={{
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease'
    }}
  >
    <Plus size={20} />
    Nouvelle Transaction
  </button>

  <button
    onClick={() => setShowTypesPanel(!showTypesPanel)}
    style={{
      background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease'
    }}
  >
    <Filter size={20} />
    Gérer les Types
  </button>
</div>
{showTypesPanel && (
  <div style={{
    background: 'white',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  }}>
    <h3 style={{ marginBottom: '10px', color: '#374151' }}>Types de Transactions</h3>

    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {typesTransaction.map(type => (
        <li key={type.id} style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '8px',
          borderBottom: '1px solid #f3f4f6',
          paddingBottom: '6px'
        }}>
          <span>{type.nom}</span>
          <button
            onClick={async () => {
              if (window.confirm("Supprimer ce type ?")) {
                const res = await fetch(`http://localhost:5000/api/caisse/types/${type.id}`, {
                  method: 'DELETE'
                });
                if (res.ok) {
                  chargerTypesTransaction();
                }
              }
            }}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Supprimer
          </button>
        </li>
      ))}
    </ul>

    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (newTypeName.trim() === '') return;
        const res = await fetch(`http://localhost:5000/api/caisse/types`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nom: newTypeName })
        });
        if (res.ok) {
          setNewTypeName('');
          chargerTypesTransaction();
        }
      }}
      style={{ marginTop: '20px', display: 'flex', gap: '10px' }}
    >
      <input
        type="text"
        placeholder="Nom du nouveau type"
        value={newTypeName}
        onChange={(e) => setNewTypeName(e.target.value)}
        style={{
          padding: '10px',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          flex: 1
        }}
      />
      <button
        type="submit"
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Ajouter
      </button>
    </form>
  </div>
)}


      {/* Formulaire */}
      {showForm && (
        <div style={{ 
          background: 'white', 
          padding: '30px', 
          borderRadius: '10px', 
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            margin: '0 0 20px 0', 
            color: '#374151',
            fontSize: '1.5em'
          }}>
            {editingTransaction ? 'Modifier la transaction' : 'Nouvelle Transaction'}
          </h2>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
                  Type d'opération *
                </label>
                <select
                  value={formData.type_operation}
                  onChange={(e) => setFormData({...formData, type_operation: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Sélectionner le type</option>
                  <option value="recette">💰 Recette</option>
                  <option value="depense">💸 Dépense</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
                  Catégorie
                </label>
                <select
                  value={formData.type_transaction_id}
                  onChange={(e) => setFormData({...formData, type_transaction_id: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {typesTransaction.map(type => (
                    <option key={type.id} value={type.id}>{type.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
                  Montant (DZ) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.montant}
                  onChange={(e) => setFormData({...formData, montant: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date_transaction}
                  onChange={(e) => setFormData({...formData, date_transaction: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '16px',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#374151' }}>
                Motif / Description *
              </label>
              <textarea
                value={formData.motif}
                onChange={(e) => setFormData({...formData, motif: e.target.value})}
                required
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.3s ease'
                }}
              >
                {loading ? 'Enregistrement...' : (editingTransaction ? 'Modifier' : 'Enregistrer')}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTransaction(null);
                  setFormData({
                    type_operation: '',
                    type_transaction_id: '',
                    montant: '',
                    motif: '',
                    date_transaction: new Date().toISOString().split('T')[0]
                  });
                }}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtres */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Filter size={20} />
          <h3 style={{ margin: 0, color: '#374151' }}>Filtres</h3>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <select
            value={filtres.type_operation}
            onChange={(e) => setFiltres({...filtres, type_operation: e.target.value})}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">Tous les types</option>
            <option value="recette">Recettes</option>
            <option value="depense">Dépenses</option>
          </select>

          <select
            value={filtres.type_transaction_id}
            onChange={(e) => setFiltres({...filtres, type_transaction_id: e.target.value})}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          >
            <option value="">Toutes les catégories</option>
            {typesTransaction.map(type => (
              <option key={type.id} value={type.id}>{type.nom}</option>
            ))}
          </select>

          <input
            type="date"
            placeholder="Date début"
            value={filtres.date_debut}
            onChange={(e) => setFiltres({...filtres, date_debut: e.target.value})}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />

          <input
            type="date"
            placeholder="Date fin"
            value={filtres.date_fin}
            onChange={(e) => setFiltres({...filtres, date_fin: e.target.value})}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />

          {/* <input
            type="number"
            placeholder="Montant min"
            value={filtres.montant_min}
            onChange={(e) => setFiltres({...filtres, montant_min: e.target.value})}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />

          <input
            type="number"
            placeholder="Montant max"
            value={filtres.montant_max}
            onChange={(e) => setFiltres({...filtres, montant_max: e.target.value})}
            style={{
              padding: '10px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          /> */}
        </div>

        <button
          onClick={resetFiltres}
          style={{
            marginTop: '15px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Réinitialiser les filtres
        </button>
      </div>

      {/* Liste des transactions */}
      <div style={{ 
        background: 'white', 
        borderRadius: '10px', 
        overflow: 'hidden',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          padding: '20px', 
          background: '#f9fafb', 
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Search size={20} />
          <h3 style={{ margin: 0, color: '#374151' }}>
            Transactions ({transactions.length})
          </h3>
        </div>

        {loading ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            Chargement...
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            color: '#6b7280' 
          }}>
            Aucune transaction trouvée
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ background: '#f9fafb' }}>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Date
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Type
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Catégorie
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'right', 
                    fontWeight: 'bold',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Montant
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'left', 
                    fontWeight: 'bold',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Motif
                  </th>
                  <th style={{ 
                    padding: '12px', 
                    textAlign: 'center', 
                    fontWeight: 'bold',
                    color: '#374151',
                    borderBottom: '1px solid #e5e7eb'
                  }}>
                    Actions
                  </th>
                </tr>
              </thead>
              
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id} 
                    style={{ 
                      background: index % 2 === 0 ? 'white' : '#f9fafb',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseOut={(e) => e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f9fafb'}
                  >
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #f3f4f6',
                      color: '#374151'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Calendar size={16} />
                        {formatDate(transaction.date_transaction)}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: transaction.type_operation === 'recette' ? '#d1fae5' : '#fee2e2',
                        color: transaction.type_operation === 'recette' ? '#065f46' : '#991b1b'
                      }}>
                        {transaction.type_operation === 'recette' ? '💰 Recette' : '💸 Dépense'}
                      </span>
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #f3f4f6',
                      color: '#6b7280'
                    }}>
                      {transaction.type_transaction_nom || 'Sans catégorie'}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #f3f4f6',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      color: transaction.type_operation === 'recette' ? '#059669' : '#dc2626'
                    }}>
                      {transaction.type_operation === 'recette' ? '+' : '-'}
                      {formatMontant(Math.abs(transaction.montant))}
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #f3f4f6',
                      color: '#374151',
                      maxWidth: '200px'
                    }}>
                      <div style={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {transaction.motif}
                      </div>
                    </td>
                    <td style={{ 
                      padding: '12px', 
                      borderBottom: '1px solid #f3f4f6',
                      textAlign: 'center'
                    }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEdit(transaction)}
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Modifier"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            padding: '6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '20px',
              padding: '20px',
              background: '#f9fafb',
              borderTop: '1px solid #e5e7eb'
            }}>
              <div>
                <strong>Total Recettes :</strong>{' '}
                {formatMontant(calculerTotalFiltré().totalRecette)}
              </div>
              <div>
                <strong>Total Dépenses :</strong>{' '}
                {formatMontant(calculerTotalFiltré().totalDepense)}
              </div>
              <div>
                <strong>Solde Net :</strong>{' '}
                <span style={{
                  color: calculerTotalFiltré().solde >= 0 ? '#059669' : '#dc2626'
                }}>
                  {formatMontant(calculerTotalFiltré().solde)}
                </span>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default GestionCaisse;