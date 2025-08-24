import express from 'express';
const router = express.Router();
import { 
  getAllWorkTypeRequests, 
  createWorkTypeRequest, 
  updateWorkTypeRequest, 
  deleteWorkTypeRequest,
  approveWorkTypeRequest,
  rejectWorkTypeRequest,
  bulkApproveRequests,
  bulkRejectRequests,
  getWorkTypeRequestsByEmployeeCode,
  getWorkTypeRequestsByUserId 
} from '../controllers/workTypeRequestController.js';
import { authenticate } from '../middleware/companyAuth.js';

// Apply authentication middleware to all routes
router.use(authenticate);

router.get('/user/:userId', getWorkTypeRequestsByUserId);

// Get all work type requests
router.get('/', getAllWorkTypeRequests);

// Create a new work type request
router.post('/', createWorkTypeRequest);

// Update, delete, approve, reject specific work type request
router.put('/:id', updateWorkTypeRequest);
router.delete('/:id', deleteWorkTypeRequest);
router.put('/:id/approve', approveWorkTypeRequest);
router.put('/:id/reject', rejectWorkTypeRequest);

// Bulk operations
router.put('/bulk-approve', bulkApproveRequests);
router.put('/bulk-reject', bulkRejectRequests);

// Get work type requests by employee code
router.get('/employee/:employeeCode', getWorkTypeRequestsByEmployeeCode);

export default router;
