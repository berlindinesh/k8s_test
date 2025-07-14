// import express from 'express';
// import {
//   getAllWorktypes,
//   getUserWorktypes,
//   createWorktype,
//   updateWorktype,
//   deleteWorktype,
//   approveWorktype,
//   rejectWorktype,
//   bulkApprove,
//   bulkReject
// } from '../controllers/rotatingWorktypeController.js';

// const router = express.Router();

// // Get all worktype requests with optional filtering
// router.get('/shifts', getAllWorktypes);

// // Get worktype requests for a specific user
// router.get('/shifts/user/:userId', getUserWorktypes);

// // Create a new worktype request
// router.post('/shifts', createWorktype);

// // Update a worktype request
// router.put('/shifts/:id', updateWorktype);

// // Delete a worktype request
// router.delete('/shifts/:id', deleteWorktype);

// // Approve a worktype request
// router.put('/shifts/:id/approve', approveWorktype);

// // Reject a worktype request
// router.put('/shifts/:id/reject', rejectWorktype);

// // Bulk approve worktype requests
// router.post('/shifts/bulk-approve', bulkApprove);

// // Bulk reject worktype requests
// router.post('/shifts/bulk-reject', bulkReject);

// export default router;

import express from 'express';
import { 
  getAllWorktypes, 
  createWorktype, 
  updateWorktype, 
  deleteWorktype,
  approveWorktype,
  rejectWorktype,
  bulkApproveWorktypes,
  bulkRejectWorktypes,
  getWorktypesByEmployeeCode,
  getUserWorktypes
} from '../controllers/rotatingWorktypeController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all worktype requests
router.get('/', getAllWorktypes);

// Create a new worktype request
router.post('/', createWorktype);

// Update, delete, approve, reject specific worktype request
router.put('/:id', updateWorktype);
router.delete('/:id', deleteWorktype);
router.put('/:id/approve', approveWorktype);
router.put('/:id/reject', rejectWorktype);

// Bulk operations
router.put('/bulk-approve', bulkApproveWorktypes);
router.put('/bulk-reject', bulkRejectWorktypes);

// Get worktype requests by employee code
router.get('/employee/:employeeCode', getWorktypesByEmployeeCode);

// Get worktype requests by user ID
router.get('/user/:userId', getUserWorktypes);

export default router;
