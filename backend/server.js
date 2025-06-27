import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectionDatabase } from './config/db.js';


const app = express();


app.use(express.json());

const PORT = 5000;

await connectionDatabase();

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    
})