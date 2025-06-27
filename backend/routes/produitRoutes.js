import express from 'express';
import {
  ajouterProduit,
  getProduits,
} from '../controllers/produitController.js';

const router = express.Router();

router.get('/', getProduits);
router.post('/', ajouterProduit);

export default router;
