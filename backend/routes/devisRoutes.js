import express from 'express';
import { getAllDevis, getDetailsDevis } from '../controllers/devisController.js';
import { connectToDatabase } from '../config/db.js'
const router = express.Router();

//router.get('/', getAllDevis);              // GET /api/devis
//router.get('/:id', getDetailsDevis);       // GET /api/devis/:id
// validation de données 

const validateDevisData = (req, res, next) => {
  const { nom, email, tel, produit, quantite } = req.body;
  
  // Validation des champs requis
  if (!nom || !email || !tel || !produit || !quantite) {
    return res.status(400).json({
      success: false,
      message: 'Tous les champs obligatoires doivent être remplis'
    });
  }
  
  // Validation de l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Format d\'email invalide'
    });
  }
  
  // Validation du téléphone
  const telRegex = /^[\d\s\+\-\(\)]{8,}$/;
  if (!telRegex.test(tel)) {
    return res.status(400).json({
      success: false,
      message: 'Numéro de téléphone invalide'
    });
  }
  
  // Validation de la quantité
  if (isNaN(quantite) || quantite <= 0) {
    return res.status(400).json({
      success: false,
      message: 'La quantité doit être un nombre positif'
    });
  }
  
  // Validation du type de produit
  const produitsValides = ['sac', 'boite', 'carton', 'autre'];
  if (!produitsValides.includes(produit)) {
    return res.status(400).json({
      success: false,
      message: 'Type de produit invalide'
    });
  }
  
  next();
};


router.post('/obtenirDevis', validateDevisData, async (req, res) => {
  try {
    const { nom, email, tel, entreprise, produit, quantite, message } = req.body;

    const connection = await connectToDatabase();

    const query = `
      INSERT INTO devis (nom, email, tel, entreprise, produit, quantite, message)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await connection.execute(query, [
      nom.trim(),
      email.trim().toLowerCase(),
      tel.trim(),
      entreprise?.trim() || null,
      produit,
      parseInt(quantite),
      message?.trim() || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Demande de devis enregistrée avec succès',
      data: {
        id: result.insertId,
        nom,
        email: email.toLowerCase(),
        produit,
        quantite: parseInt(quantite)
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du devis :', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'enregistrement du devis'
    });
  }
});




router.get('getDevis', async (req, res) => {
  try {


    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const connection = await connectToDatabase();
    const query = `
      SELECT id, nom, email, tel, entreprise, produit, quantite, 
             message, date_creation, statut
      FROM devis
      ORDER BY date_creation DESC
      LIMIT ? OFFSET ?
    `;
    
    const [rows] = await connection.execute(query, [limit, offset]);
    
    // Compter le total
    const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM demandes_devis');
    const total = countResult[0].total;
    
    res.json({
      success: true,
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données'
    });
  }
});

// route pour récupérer tous les devis

router.get('/getAllDevis', async (req, res) => {    
    try{        
        const connection = await connectToDatabase();
        const query = `SELECT * FROM DEVIS ORDER BY date_creation DESC`;
        const [rows] = await connection.execute(query);
        //const [countResult] = await connection.execute('SELECT COUNT(*) as total FROM demandes_devis');
        res.json({
      success: true,
      data: rows,
    });
    

    }catch(error){
        console.error('Erreur lors de la récupération:', error);
        res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des données'
    });
    }
});

// Route pour récupérer une demande spécifique
router.get('/devisDetails&id=id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID invalide'
      });
    }
    
    const query = 'SELECT * FROM demandes_devis WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données'
    });
  }
});



// Route pour mettre à jour le statut d'une demande
router.patch('/:id/statut', async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const connection = await connectToDatabase();

    const statutsValides = ['nouveau', 'en_cours', 'traite', 'ferme'];
    if (!statutsValides.includes(statut)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }
    
    const query = 'UPDATE devis SET statut = ? WHERE id = ?';
    const [result] = await connection.execute(query, [statut, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Demande non trouvée'
      });
    }
    
    res.json({
      success: true,
      message: 'Statut mis à jour avec succès'
    });
    
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    });
  }
});

// Middleware de gestion d'erreurs global


export default router;
