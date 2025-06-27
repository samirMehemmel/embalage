import express from 'express';
import {
    getAllDevis,
    getDetailsDevis
} from '../controllers/devisController.js'
const router = express.Router();


router.get('/AllDevis', getAllDevis);
router.get('/detailsDevis', getDetailsDevis);


export default router;