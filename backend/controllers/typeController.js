import { connectToDatabase } from "../config/db.js";

export const createType = async (req, res) => {
  try {
    const { nom } = req.body;

    if (!nom || nom.trim() === '') {
      return res.status(400).json({ error: "Le champ 'nom' est requis." });
    }

    const connection = await connectToDatabase();

    // Vérifier s'il existe déjà
    const [existing] = await connection.execute(
      'SELECT id FROM TYPE_CAISSE WHERE nom = ?',
      [nom]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Ce type existe déjà." });
    }

    const [result] = await connection.execute(
      'INSERT INTO TYPE_CAISSE (nom) VALUES (?)',
      [nom]
    );

    res.status(201).json({
      message: '✅ Type créé avec succès',
      id: result.insertId,
      nom,
    });

  } catch (err) {
    console.error('❌ Erreur lors de la création du type :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



export const getTypes = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM TYPE_CAISSE');

    res.status(200).json({
      types: rows, 
    });

  } catch (err) {
    console.error('❌ Erreur lors de la récupération des types :', err.message);
    res.status(500).json({
      error: 'Erreur lors de la requête SQL',
    });
  }
};

export const updateType = async (req, res) => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    if (!nom || nom.trim() === '') {
      return res.status(400).json({ error: "Le champ 'nom' est requis." });
    }

    const connection = await connectToDatabase();

    // Vérifie si le type existe
    const [existing] = await connection.execute(
      'SELECT id FROM TYPE_CAISSE WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: "Type non trouvé." });
    }

    // Mise à jour
    await connection.execute(
      'UPDATE TYPE_CAISSE SET nom = ? WHERE id = ?',
      [nom, id]
    );

    res.status(200).json({
      message: '✅ Type mis à jour avec succès',
      id,
      nom
    });

  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour du type :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

