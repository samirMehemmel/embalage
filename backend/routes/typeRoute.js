import express from 'express';
import { getTypes, createType, updateType } from '../controllers/typeController.js';

const router = express.Router();

router.get('/', getTypes);
router.post('/', createType);
router.put('/:id', updateType);


export default router;
