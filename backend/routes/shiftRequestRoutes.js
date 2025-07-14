import express from 'express';
const router = express.Router();
import {
  getAllShiftRequests,
  createShiftRequest,
  updateShiftRequest,
  deleteShiftRequest,
  approveShiftRequest,
  rejectShiftRequest,
  bulkApproveRequests,
  bulkRejectRequests,
  getUserShiftRequests
} from '../controllers/shiftRequestController.js';
import { authenticate } from '../middleware/companyAuth.js';

// Apply authentication middleware to all routes
router.use(authenticate);

// Admin routes - for all shift requests and review
router.get('/shifts', getAllShiftRequests);

// User-specific routes
router.get('/shifts/user/:userId', getUserShiftRequests);

// Create new shift request
router.post('/shifts', createShiftRequest);

// Update, delete, approve, reject specific shift request
router.put('/shifts/:id', updateShiftRequest);
router.delete('/shifts/:id', deleteShiftRequest);
router.put('/shifts/:id/approve', approveShiftRequest);
router.put('/shifts/:id/reject', rejectShiftRequest);

// Bulk operations
router.post('/shifts/bulk-approve', bulkApproveRequests);
router.post('/shifts/bulk-reject', bulkRejectRequests);

export default router;
