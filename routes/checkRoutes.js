import express from 'express';
import { checkText, checkImage, getRecentChecks, saveClaimResult} from '../controllers/checkController.js';

const router = express.Router();

// Route for checking text claims
router.post('/text', checkText);

// Route for checking image claims
router.post('/image', checkImage);

// Route to get recent checks
router.get('/recent', getRecentChecks);

// Route for saving claim result (new endpoint)
router.post('/save', saveClaimResult); 

export default router;
