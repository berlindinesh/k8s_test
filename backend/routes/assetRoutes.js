import express from 'express';
import { createAssetsFromBatch } from '../controllers/assetController.js';

const router = express.Router();

// Other asset routes...
router.post('/api/assets/from-batch', createAssetsFromBatch);

export default router;
