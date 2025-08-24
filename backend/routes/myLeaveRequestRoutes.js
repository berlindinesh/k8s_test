import express from 'express';
import {
  getAllLeaveRequests,
  createLeaveRequest,
  updateLeaveComment,
  deleteLeaveRequest,
  approveLeaveRequest,
  rejectLeaveRequest,
  getEmployeeLeaveRequests,
  getLeaveBalance,
  getLeaveStatistics,
  resetAnnualLeaves,
  recalculateLeaveBalance,
  updateEarnedLeaveBalance,
  bulkApproveLeaveRequests,
  bulkRejectLeaveRequests
} from '../controllers/myLeaveRequestController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Employee routes
router.get('/employee/:employeeCode', getEmployeeLeaveRequests);
router.get('/balance/:employeeCode', getLeaveBalance);
router.get('/statistics/:employeeCode', getLeaveStatistics);

// Admin/HR routes
router.get('/', getAllLeaveRequests);
router.post('/', createLeaveRequest);
router.delete('/:id', deleteLeaveRequest);
router.put('/:id/approve', approveLeaveRequest);
router.put('/:id/reject', rejectLeaveRequest);
router.post('/reset-annual', resetAnnualLeaves);
router.post('/update-earned-leave', updateEarnedLeaveBalance);
router.post('/recalculate-balance/:employeeCode', recalculateLeaveBalance);

// Bulk operations
router.post('/bulk-approve', bulkApproveLeaveRequests);
router.post('/bulk-reject', bulkRejectLeaveRequests);

// Comment update route
router.put('/:id', updateLeaveComment);

export default router;
