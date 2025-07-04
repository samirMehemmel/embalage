import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectToDatabase } from './config/db.js';

// Routes
import typeRoutes from './routes/typeRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import devisRoutes from './routes/devisRoutes.js';
import caisseRoutes from './routes/caisseRoutes.js';
import produitRoutes from './routes/produitRoutes.js'

dotenv.config(); // charger .env

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // frontend React
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Routes API
app.use('/api/types', typeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/caisse', caisseRoutes);
app.use('/api/produits', produitRoutes);

// Port et démarrage
const PORT = process.env.PORT || 5000;

await connectToDatabase();
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur'
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
