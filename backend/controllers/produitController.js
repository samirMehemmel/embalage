import { sqlPool } from '../config/db.js';



export const getProduits = async (req, res) => {
  try {
    const request = sqlPool.request();
    const result = await request.query('SELECT * FROM PRODUIT');

    res.status(200).json({
      produits: result.recordset, 
    });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des produits:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};





export const ajouterProduit = async (req, res) => {
  const { nom } = req.body;


  res.status(201).json({ message: "Produit ajouté" });
};
