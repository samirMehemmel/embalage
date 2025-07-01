import express from 'express';
import { loginAdmin, ajouterAdmin } from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', loginAdmin); 
router.post('/ajouter', ajouterAdmin);


export default router;
