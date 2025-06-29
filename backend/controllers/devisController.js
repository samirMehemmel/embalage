import { connectToDatabase } from '../config/db.js';

// ✅ Récupérer tous les devis
export const getAllDevis = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM DEVIS');

    res.status(200).json({
      devis: rows,
    });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération des devis :', err.message);
    res.status(500).json({
      error: 'Erreur lors de la requête SQL',
    });
  }
};

// ✅ Récupérer un seul devis par son id
export const getDetailsDevis = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM DEVIS WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Devis non trouvé' });
    }

    res.status(200).json({
      details: rows[0],
    });
  } catch (err) {
    console.error('❌ Erreur lors de la récupération du devis :', err.message);
    res.status(500).json({
      error: 'Erreur lors de la requête SQL',
    });
  }
};
