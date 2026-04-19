import express from 'express';
import { scanText, scanUrl, scanAudio } from '../controllers/scanController.js';

const router = express.Router();

router.post('/text', scanText);
router.post('/url', scanUrl);
router.post('/audio', scanAudio);

export default router;
