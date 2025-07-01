import { connectToDatabase } from "../config/db.js";


export const getCaisse = async (req, res) => {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute(`
      SELECT c.*, t.libelle AS libelle_type
      FROM CAISSE c
      LEFT JOIN TYPE_CAISSE t ON c.id_type = t.id
      ORDER BY c.date_heure DESC
    `);

    res.status(200).json({ caisse: rows });

  } catch (err) {
    console.error('Erreur lors de la récupération de la caisse :', err.message);
    res.status(500).json({ error: 'Erreur lors de la requête SQL' });
  }
};


   export const insertCaisse = async (req, res) => {
  try {
    const { montant, type, motif, id_admin, id_type } = req.body;

    // Vérification simple
    if (!montant || !type || !id_admin) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    const connection = await connectToDatabase();

    const sql = `
      INSERT INTO CAISSE (montant, type, motif, id_admin, id_type)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [montant, type, motif || null, id_admin, id_type || null];

    const [result] = await connection.execute(sql, values);

    res.status(201).json({
      message: "✅ Mouvement de caisse inséré avec succès",
      id: result.insertId,
    });

  } catch (err) {
    console.error('❌ Erreur lors de l’insertion dans la caisse :', err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};
