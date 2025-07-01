import express from 'express';

import {
    getCaisse, insertCaisse
} from '../controllers/caisseController.js'

const router = express.Router();

router.get('/', getCaisse);
router.post('/', insertCaisse);



export default router;
