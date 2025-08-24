import express from 'express';
import {
  getAllShifts,
  getUserShifts,
  createShift,
  updateShift,
  deleteShift,
  approveShift,
  rejectShift,
  bulkApproveShifts,
  bulkRejectShifts
} from '../controllers/rotatingShiftController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all shifts (with optional filters)
router.get('/', getAllShifts);

// Get shifts for a specific user
router.get('/user/:userId', getUserShifts);

// Create a new shift
router.post('/', createShift);

// Update, delete, approve, reject a specific shift
router.put('/:id', updateShift);
router.delete('/:id', deleteShift);
router.put('/:id/approve', approveShift);
router.put('/:id/reject', rejectShift);

// Bulk operations
router.post('/bulk-approve', bulkApproveShifts);
router.post('/bulk-reject', bulkRejectShifts);

export default router;
