import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST,        // Par exemple : localhost
  user: process.env.DB_USER,        // Ton utilisateur MySQL
  password: process.env.DB_PASSWORD,// Ton mot de passe
  database: process.env.DB_NAME     // Le nom de la base
};

let connection;

async function connectToDatabase() {
  try {
    console.log('Tentative de connexion à la base de données MySQL...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Connexion MySQL établie avec succès');
    return connection;
  } catch (err) {
    console.error('❌ Erreur de connexion MySQL:', err.message);
    console.error('Stack:', err.stack);
    return null;
  }
}

export { connectToDatabase };
