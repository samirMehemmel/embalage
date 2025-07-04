import React, { useState } from 'react';
import './ObtenirDevis.css';

function ObtenirDevis() {
  // État pour gérer les données du formulaire
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    tel: '',
    entreprise: '',
    produit: '',
    quantite: '',
    message: ''
  });

  // État pour gérer le chargement et les messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  // Validation côté client
  const validateForm = () => {
    const { nom, email, tel, produit, quantite } = formData;
    
    if (!nom.trim()) {
      setMessage({ type: 'error', text: 'Le nom est requis' });
      return false;
    }
    
    if (!email.trim()) {
      setMessage({ type: 'error', text: 'L\'email est requis' });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ type: 'error', text: 'Format d\'email invalide' });
      return false;
    }
    
    if (!tel.trim()) {
      setMessage({ type: 'error', text: 'Le téléphone est requis' });
      return false;
    }
    
    const telRegex = /^[\d\s\+\-\(\)]{8,}$/;
    if (!telRegex.test(tel)) {
      setMessage({ type: 'error', text: 'Numéro de téléphone invalide (minimum 8 caractères)' });
      return false;
    }
    
    if (!produit) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner un type d\'emballage' });
      return false;
    }
    
    if (!quantite || isNaN(quantite) || quantite <= 0) {
      setMessage({ type: 'error', text: 'Veuillez entrer une quantité valide' });
      return false;
    }
    
    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      // URL de votre API backend (ajustez selon votre configuration)
      
      const response = await fetch(`http://localhost:5000/api/devis/obtenirDevis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: formData.nom.trim(),
          email: formData.email.trim().toLowerCase(),
          tel: formData.tel.trim(),
          entreprise: formData.entreprise.trim() || null,
          produit: formData.produit,
          quantite: parseInt(formData.quantite),
          message: formData.message.trim() || null
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ 
          type: 'success', 
          text: 'Votre demande de devis a été envoyée avec succès ! Nous vous contacterons bientôt.' 
        });
        
        // Réinitialiser le formulaire après succès
        setFormData({
          nom: '',
          email: '',
          tel: '',
          entreprise: '',
          produit: '',
          quantite: '',
          message: ''
        });
        
        // Faire défiler vers le haut pour voir le message de succès
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } else {
        setMessage({ 
          type: 'error', 
          text: data.message || 'Une erreur est survenue lors de l\'envoi de votre demande' 
        });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      
      // Gestion d'erreurs plus spécifique
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setMessage({ 
          type: 'error', 
          text: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: 'Erreur de connexion. Veuillez réessayer plus tard.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="devis-page">
      <section className="devis-hero">
        <h1>Demande de devis</h1>
        <p>Nous vous répondons rapidement avec une offre adaptée à vos besoins.</p>
      </section>

      <section className="devis-form-section">
        <div className="devis-form-container">
          {/* Affichage des messages de succès/erreur */}
          {message.text && (
            <div className={`message ${message.type}`} role="alert">
              {message.text}
            </div>
          )}
          
          <form className="devis-form" onSubmit={handleSubmit}>
            <label htmlFor="nom">Nom complet *</label>
            <input 
              type="text" 
              id="nom" 
              name="nom" 
              value={formData.nom}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="Entrez votre nom complet"
            />

            <label htmlFor="email">Adresse e-mail *</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="exemple@email.com"
            />

            <label htmlFor="tel">Numéro de téléphone *</label>
            <input 
              type="tel" 
              id="tel" 
              name="tel" 
              value={formData.tel}
              onChange={handleChange}
              required 
              disabled={loading}
              placeholder="+33 1 23 45 67 89"
            />

            <label htmlFor="entreprise">Nom de l'entreprise</label>
            <input 
              type="text" 
              id="entreprise" 
              name="entreprise" 
              value={formData.entreprise}
              onChange={handleChange}
              disabled={loading}
              placeholder="Nom de votre entreprise (optionnel)"
            />

            <label htmlFor="produit">Type d'emballage souhaité *</label>
            <select 
              id="produit" 
              name="produit" 
              value={formData.produit}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">-- Sélectionnez --</option>
              <option value="sac">Sac kraft personnalisé</option>
              <option value="boite">Boîte alimentaire</option>
              <option value="carton">Carton d'expédition</option>
              <option value="autre">Autre</option>
            </select>

            <label htmlFor="quantite">Quantité estimée *</label>
            <input 
              type="number" 
              id="quantite" 
              name="quantite" 
              value={formData.quantite}
              onChange={handleChange}
              min="1"
              step="1"
              required 
              disabled={loading}
              placeholder="Nombre d'unités souhaité"
            />

            <label htmlFor="message">Détails supplémentaires</label>
            <textarea 
              id="message" 
              name="message" 
              rows="5"
              value={formData.message}
              onChange={handleChange}
              disabled={loading}
              placeholder="Décrivez vos besoins spécifiques, dimensions, couleurs, etc."
            ></textarea>

            <button 
              type="submit" 
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                'Envoyer la demande'
              )}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default ObtenirDevis;