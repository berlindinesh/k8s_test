// import express from 'express';
// import {
//   getAllAssetBatches,
//   getAssetBatchById,
//   getAssetBatchByNumber,
//   createAssetBatch,
//   updateAssetBatch,
//   deleteAssetBatch,
//   getAssetsByBatch
// } from '../controllers/assetBatchController.js';

// const router = express.Router();

// // Get all batches
// router.get('/', getAllAssetBatches);

// // Get a single batch by ID
// router.get('/:id', getAssetBatchById);

// // Get a single batch by batch number
// router.get('/by-number/:batchNumber', getAssetBatchByNumber);

// // Create a new batch
// router.post('/', createAssetBatch);

// // Update a batch
// router.put('/:id', updateAssetBatch);

// // Delete a batch
// router.delete('/:id', deleteAssetBatch);

// // Get assets by batch
// router.get('/:batchNumber/assets', getAssetsByBatch);

// export default router;

import express from 'express';
import {
  getAllAssetBatches,
  getAssetBatchById,
  getAssetBatchByNumber,
  createAssetBatch,
  updateAssetBatch,
  deleteAssetBatch,
  getAssetsByBatch
} from '../controllers/assetBatchController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all batches
router.get('/', getAllAssetBatches);

// Get a single batch by ID
router.get('/:id', getAssetBatchById);

// Get a single batch by batch number
router.get('/by-number/:batchNumber', getAssetBatchByNumber);

// Create a new batch
router.post('/', createAssetBatch);

// Update a batch
router.put('/:id', updateAssetBatch);

// Delete a batch
router.delete('/:id', deleteAssetBatch);

// Get assets by batch
router.get('/:batchNumber/assets', getAssetsByBatch);

export default router;
