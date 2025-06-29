import express from 'express';
import { getAllDevis, getDetailsDevis } from '../controllers/devisController.js';

const router = express.Router();

router.get('/', getAllDevis);              // GET /api/devis
router.get('/:id', getDetailsDevis);       // GET /api/devis/:id

export default router;
