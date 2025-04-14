import express from 'express';
import { checkText, checkImage, getRecentChecks } from '../controllers/checkController.js';

const router = express.Router();

router.post('/', checkText);
router.post('/image', checkImage);
router.get('/recent', getRecentChecks);

export default router;
