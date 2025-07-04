import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Users, Shield, Mail, User, AlertCircle, Check } from 'lucide-react';

const UtilisateursAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    mot_de_passe: '',
    role: 'admin'
  });

  // Fonction pour afficher les messages
  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Récupérer tous les admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/');
      const data = await response.json();
      
      if (response.ok) {
        setAdmins(data.admins || []);
      } else {
        showMessage('error', 'Erreur lors du chargement des admins');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un admin
  const handleAddAdmin = async () => {    
    if (!formData.nom || !formData.email || !formData.mot_de_passe) {
      showMessage('error', 'Tous les champs sont requis');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/admin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        showMessage('success', 'Admin ajouté avec succès');
        setFormData({ nom: '', email: '', mot_de_passe: '', role: 'admin' });
        setShowForm(false);
        fetchAdmins();
      } else {
        showMessage('error', data.error || 'Erreur lors de l\'ajout');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un admin
  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet admin ?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/admin/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showMessage('success', 'Admin supprimé avec succès');
        fetchAdmins();
      } else {
        showMessage('error', 'Erreur lors de la suppression');
      }
    } catch (error) {
      showMessage('error', 'Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  // Charger les admins au montage du composant
  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={styles.container}>
      <style>{cssStyles}</style>
      
      <div style={styles.wrapper}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.headerLeft}>
              <div style={styles.iconContainer}>
                <Users size={24} color="#2563eb" />
              </div>
              <div>
                <h1 style={styles.title}>Gestion des Admins</h1>
                <p style={styles.subtitle}>Gérer les administrateurs du système</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              style={styles.addButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#1d4ed8'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#2563eb'}
            >
              <Plus size={16} />
              <span>Ajouter Admin</span>
            </button>
          </div>
        </div>

        {/* Messages */}
        {message.text && (
          <div style={{
            ...styles.message,
            ...(message.type === 'success' ? styles.messageSuccess : styles.messageError)
          }}>
            {message.type === 'success' ? (
              <Check size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showForm && (
          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Ajouter un Nouvel Admin</h2>
            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <User size={16} style={styles.labelIcon} />
                  Nom
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Nom complet"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Mail size={16} style={styles.labelIcon} />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="email@exemple.com"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Shield size={16} style={styles.labelIcon} />
                  Mot de passe
                </label>
                <input
                  type="password"
                  name="mot_de_passe"
                  value={formData.mot_de_passe}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Mot de passe sécurisé"
                  required
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Shield size={16} style={styles.labelIcon} />
                  Rôle
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="moderateur">Modérateur</option>
                </select>
              </div>

              <div style={styles.buttonGroup}>
                <button
                  onClick={handleAddAdmin}
                  disabled={loading}
                  style={{
                    ...styles.submitButton,
                    opacity: loading ? 0.5 : 1,
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#059669')}
                  onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#10b981')}
                >
                  <Plus size={16} />
                  <span>{loading ? 'Ajout...' : 'Ajouter'}</span>
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={styles.cancelButton}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des admins */}
        <div style={styles.tableContainer}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>
              Liste des Admins ({admins.length})
            </h2>
          </div>

          {loading && !showForm ? (
            <div style={styles.loadingContainer}>
              <div style={styles.spinner}></div>
              <p style={styles.loadingText}>Chargement...</p>
            </div>
          ) : admins.length === 0 ? (
            <div style={styles.emptyContainer}>
              <Users size={48} color="#9ca3af" />
              <p style={styles.emptyText}>Aucun admin trouvé</p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead style={styles.thead}>
                  <tr>
                    <th style={styles.th}>Admin</th>
                    <th style={styles.th}>Email</th>
                    <th style={styles.th}>Rôle</th>
                    <th style={{...styles.th, textAlign: 'right'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={admin.id} style={{
                      ...styles.tr,
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                    }}>
                      <td style={styles.td}>
                        <div style={styles.adminCell}>
                          <div style={styles.avatar}>
                            <User size={20} color="#2563eb" />
                          </div>
                          <div>
                            <div style={styles.adminName}>{admin.nom}</div>
                            <div style={styles.adminId}>ID: {admin.id_admin}</div>
                          </div>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.email}>{admin.email}</div>
                      </td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.badge,
                          ...(admin.role === 'super_admin' 
                            ? styles.badgePurple
                            : admin.role === 'moderateur'
                            ? styles.badgeYellow
                            : styles.badgeBlue)
                        }}>
                          {admin.role}
                        </span>
                      </td>
                    
                      <td style={{...styles.td, textAlign: 'right'}}>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id_admin)}
                          style={styles.deleteButton}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#7f1d1d';
                            e.target.style.backgroundColor = '#fef2f2';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#dc2626';
                            e.target.style.backgroundColor = 'transparent';
                          }}
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '24px'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '16px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  iconContainer: {
    backgroundColor: '#dbeafe',
    padding: '12px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1f2937',
    margin: 0
  },
  subtitle: {
    color: '#6b7280',
    margin: '4px 0 0 0'
  },
  addButton: {
    backgroundColor: '#2563eb',
    color: 'white',
    padding: '12px 16px',
    borderRadius: '8px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  message: {
    marginBottom: '24px',
    padding: '16px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    border: '1px solid'
  },
  messageSuccess: {
    backgroundColor: '#f0fdf4',
    color: '#166534',
    borderColor: '#bbf7d0'
  },
  messageError: {
    backgroundColor: '#fef2f2',
    color: '#991b1b',
    borderColor: '#fecaca'
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px'
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '16px'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '8px'
  },
  labelIcon: {
    display: 'inline'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '16px',
    marginTop: '8px'
  },
  submitButton: {
    backgroundColor: '#10b981',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  cancelButton: {
    backgroundColor: '#6b7280',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'background-color 0.2s'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  tableHeader: {
    padding: '24px',
    borderBottom: '1px solid #e5e7eb'
  },
  tableTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0
  },
  loadingContainer: {
    padding: '32px',
    textAlign: 'center'
  },
  spinner: {
    width: '32px',
    height: '32px',
    border: '2px solid #e5e7eb',
    borderTop: '2px solid #2563eb',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },
  loadingText: {
    marginTop: '8px',
    color: '#6b7280'
  },
  emptyContainer: {
    padding: '32px',
    textAlign: 'center'
  },
  emptyText: {
    marginTop: '16px',
    color: '#6b7280'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  thead: {
    backgroundColor: '#f9fafb'
  },
  th: {
    padding: '12px 24px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  tr: {
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '16px 24px',
    whiteSpace: 'nowrap'
  },
  adminCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  adminName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937'
  },
  adminId: {
    fontSize: '12px',
    color: '#6b7280'
  },
  email: {
    fontSize: '14px',
    color: '#1f2937'
  },
  badge: {
    display: 'inline-flex',
    padding: '4px 8px',
    fontSize: '12px',
    fontWeight: '600',
    borderRadius: '9999px'
  },
  badgeBlue: {
    backgroundColor: '#dbeafe',
    color: '#1e40af'
  },
  badgePurple: {
    backgroundColor: '#f3e8ff',
    color: '#7c3aed'
  },
  badgeYellow: {
    backgroundColor: '#fef3c7',
    color: '#d97706'
  },
  date: {
    fontSize: '14px',
    color: '#6b7280'
  },
  deleteButton: {
    color: '#dc2626',
    backgroundColor: 'transparent',
    border: 'none',
    padding: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'color 0.2s, background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
};

const cssStyles = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  input:focus, select:focus {
    border-color: #2563eb !important;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1) !important;
  }

  tr:hover {
    background-color: #f9fafb !important;
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr !important;
    }
    
    .header-content {
      flex-direction: column !important;
      align-items: stretch !important;
    }

    .table-wrapper {
      overflow-x: scroll !important;
    }
  }
`;

export default UtilisateursAdmin;