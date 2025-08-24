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
