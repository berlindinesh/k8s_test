import express from 'express';
import { authenticate } from '../middleware/companyAuth.js';
import { 
  getAllAssets, 
  createAsset, 
  updateAsset, 
  deleteAsset, 
  getSummaryData 
} from '../controllers/assetHistoryController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET all assets
router.get('/', getAllAssets);

// POST create a new asset
router.post('/', createAsset);

// PUT update an asset
router.put('/:id', updateAsset);

// DELETE an asset
router.delete('/:id', deleteAsset);

// GET summary data for the dashboard
router.get('/summary', getSummaryData);

export default router;
