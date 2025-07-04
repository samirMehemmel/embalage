import { connectToDatabase } from "../config/db.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';



export const addAdmin = async (req, res) => {
  try {
    const { nom, email, mot_de_passe, role } = req.body;
    
    if (!nom || !email || !mot_de_passe) {
      return res.status(400).json({ error: "Tous les champs sont requis." });
    }

    const connection = await connectToDatabase();

    // Vérifie si l'admin existe déjà
    const [existing] = await connection.execute(
      'SELECT id_admin FROM ADMIN WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Cet email est déjà utilisé." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    // Insertion
    const [result] = await connection.execute(
      'INSERT INTO ADMIN (nom, email, password, role) VALUES (?, ?, ?, ?)',
      [nom, email, hashedPassword, role || 'admin']
    );

    res.status(201).json({
      message: "✅ Admin ajouté avec succès.",
      id: result.insertId
    });

  } catch (err) {
    console.error("❌ Erreur lors de l'ajout d'un admin :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
};



export const getAllAdmins = async (req, res) =>{
    try{
        const connection = await connectToDatabase();
        const [rows] = await connection.execute('SELECT * FROM admin');
        res.status(200).json({
            admins : rows
        })

    } catch(err){
        console.error('erreur');
        res.status(500).json({
            error: 'Erreur serveur'
        });
    }
};


// login admin 



export const loginAdmin = async (req, res) => {
  const { email, mot_de_passe } = req.body;

  const SECRET_KEY = process.env.JWT_SECRET || 'dev-secret';
    console.log(email, mot_de_passe);
    
  if (!email || !mot_de_passe) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute('SELECT * FROM admin WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    const admin = rows[0];
    

    const isMatch = await bcrypt.compare(mot_de_passe, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        nom: admin.nom,
        role: admin.role,
      },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      admin: {
        id: admin.id,
        nom: admin.nom,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Erreur login admin:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    // Vérifie que l'ID est fourni
    if (!id) {
      return res.status(400).json({ error: "ID requis pour la suppression" });
    }

    const connection = await connectToDatabase();

    // Supprime l'admin
    const [result] = await connection.execute(
      'DELETE FROM ADMIN WHERE id_admin = ?',
      [id]
    );

    // Vérifie s’il y avait bien un admin à supprimer
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Aucun administrateur trouvé avec cet ID" });
    }

    res.status(200).json({ message: "✅ Administrateur supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur lors de la suppression de l'administrateur :", err.message);
    res.status(500).json({ error: "Erreur serveur lors de la suppression" });
  }
};