import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { connectToDatabase } from './config/db.js';

// Routes
import typeRoutes from './routes/typeRoute.js';
import adminRoutes from './routes/adminRoutes.js';
import devisRoutes from './routes/devisRoutes.js';
import caisseRoutes from './routes/caisseRoutes.js';

dotenv.config(); // charger .env

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // frontend React
  credentials: true
}));
app.use(express.json());

// Routes API
app.use('/api/types', typeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/devis', devisRoutes);
app.use('/api/caisse', caisseRoutes);

// Port et démarrage
const PORT = process.env.PORT || 5000;

await connectToDatabase();

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});
