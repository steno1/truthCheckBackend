import express from 'express';
import { reportClaim } from '../controllers/reportController.js';

const router = express.Router();
router.post('/', reportClaim);

export default router;
