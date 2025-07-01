// insertAdmin.js

import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function insertAdmin() {
  try {
    const nom = 'Samir Mehemmel';
    const email = 'mehemmelsamir@gmail.com';
    const motDePasse = 'madzankoro00';
    const role = 'Dev';

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(motDePasse, 10);

    // Connexion à MySQL
    const connection = await mysql.createConnection(dbConfig);

    // Insertion dans la table ADMIN
    const [result] = await connection.execute(
      'INSERT INTO ADMIN (nom, email, password, role) VALUES (?, ?, ?, ?)',
      [nom, email, hashedPassword, role]
    );

    console.log('✅ Admin inséré avec succès. ID :', result.insertId);

    await connection.end();
  } catch (err) {
    console.error('❌ Erreur lors de l’insertion :', err.message);
  }
}

insertAdmin();
