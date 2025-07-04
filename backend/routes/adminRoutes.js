import express from 'express';
import {
  getAllAdmins,
  addAdmin,
  deleteAdmin,
  loginAdmin,
} from '../controllers/adminController.js';

const router = express.Router();

router.get('/', getAllAdmins); // GET /api/admin
router.post('/', addAdmin);    // POST /api/admin
router.delete('/:id', deleteAdmin); // DELETE /api/admin/:id
router.post('/login', loginAdmin)
export default router;
