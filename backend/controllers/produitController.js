import { connectToDatabase } from '../config/db.js';


export const getProduits = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM PRODUIT');

    res.status(200).json({ produits: rows });
  } catch (err) {
    console.error(' Erreur lors de la récupération des produits:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


export const ajouterProduit = async (req, res) => {
  const { nom, type, mesures, description, prix } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!nom || !type || !mesures || !description || !prix || !image) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const connection = await connectToDatabase();
    const sql = `
      INSERT INTO PRODUIT (nom, type, mesures, description, image, prix)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(sql, [nom, type, mesures, description, image, prix]);

    res.status(201).json({ message: '✅ Produit ajouté avec succès' });
  } catch (err) {
    console.error('❌ Erreur lors de l’ajout du produit:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



// Supprimer un produit
export const supprimerProduit = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM PRODUIT WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.status(200).json({ message: '🗑️ Produit supprimé avec succès' });
  } catch (err) {
    console.error('❌ Erreur lors de la suppression:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Modifier un produit
export const modifierProduit = async (req, res) => {
  const { id } = req.params;
  const { nom, type, mesures, description, image, prix } = req.body;

  if (!nom || !type || !mesures || !description || !image || !prix) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const connection = await connectToDatabase();
    const [result] = await connection.execute(`
      UPDATE PRODUIT
      SET nom = ?, type = ?, mesures = ?, description = ?, image = ?, prix = ?
      WHERE id = ?
    `, [nom, type, mesures, description, image, prix, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }

    res.status(200).json({ message: '✏️ Produit modifié avec succès' });
  } catch (err) {
    console.error('❌ Erreur lors de la modification:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

