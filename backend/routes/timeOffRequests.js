import express from 'express';
import {
  getAllRequests,
  getRequestsByUserId,
  createRequest,
  getRequestById,
  updateRequest,
  deleteRequest,
  getRequestStats
} from '../controllers/timeOffRequestController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.get('/', getAllRequests);
router.get('/stats', getRequestStats);
router.get('/user/:userId', getRequestsByUserId);
router.get('/:id', getRequestById);
router.post('/', createRequest);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);

export default router;
