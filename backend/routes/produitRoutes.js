import express from 'express';
import {
  ajouterProduit,
  getProduits,
  modifierProduit,
  supprimerProduit,
  
} from '../controllers/produitController.js';

const router = express.Router();

router.get('/getproduct', getProduits);
router.post('/addproduct', ajouterProduit);
router.put('/modifierproduit', modifierProduit);
router.delete('/delete',supprimerProduit);
export default router;
