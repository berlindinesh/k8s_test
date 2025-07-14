import express from 'express';
import { 
  getAttendanceStats, 
  getAttendanceTrends,
  getWorkTypeDistribution,
  getDepartmentSummary
} from '../controllers/dashboardController.js';

const router = express.Router();

// Dashboard routes
router.get('/api/dashboard/attendance-stats', getAttendanceStats);
router.get('/api/dashboard/attendance-trends', getAttendanceTrends);
router.get('/api/dashboard/work-type-distribution', getWorkTypeDistribution);
router.get('/api/dashboard/department-summary', getDepartmentSummary);

export default router;
