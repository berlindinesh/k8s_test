// import express from 'express';
// import {
//   getAllShifts,
//   getUserShifts,
//   createShift,
//   updateShift,
//   deleteShift,
//   approveShift,
//   rejectShift,
//   bulkApprove,
//   bulkReject
// } from '../controllers/rotatingShiftController.js';

// const router = express.Router();

// // Admin routes - for all shift requests
// router.get('/shifts', getAllShifts);

// // User-specific routes
// router.get('/shifts/user/:userId', getUserShifts);

// // Create new shift request
// router.post('/shifts', createShift);

// // Update, delete, approve, reject specific shift request
// router.put('/shifts/:id', updateShift);
// router.delete('/shifts/:id', deleteShift);
// router.put('/shifts/:id/approve', approveShift);
// router.put('/shifts/:id/reject', rejectShift);

// // Bulk operations
// router.post('/shifts/bulk-approve', bulkApprove);
// router.post('/shifts/bulk-reject', bulkReject);

// export default router;

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
