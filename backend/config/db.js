import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const sqlPool = new sql.ConnectionPool(dbConfig);

async function connectionDatabase() {
  try {
    console.log('Tentative de connexion à la base de données MSSQL...');
    await sqlPool.connect();
    console.log('✅ Connexion MSSQL établie avec succès');
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion MSSQL:', err.message);
    console.error('Stack:', err.stack);
    return false;
  }
}

export { sqlPool, connectionDatabase };
