import express from 'express';
import {
  ajouterProduit,
  getProduits,
  modifierProduit,
  supprimerProduit,
  
} from '../controllers/produitController.js';
import multer from 'multer';

// Config stockage (uploads dans /uploads dossier)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // créer ce dossier s'il n'existe pas
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

const router = express.Router();

router.get('/getproduct', getProduits);
router.post('/addproduct', upload.single('image'), ajouterProduit);
router.put('/modifierproduit', modifierProduit);
router.delete('/delete/:id', supprimerProduit);
export default router;
