// import express from 'express';
// import {
//   getLeaveRequests,
//   createLeaveRequest,
//   updateLeaveRequest,
//   deleteLeaveRequest,
//   updateLeaveStatus,
//   updateLeaveComment,
//   getEmployeeLeaveRequests
// } from '../controllers/leaveRequestController.js';

// const router = express.Router();

// // Routes for both HR/admin and employees
// router.get('/', getLeaveRequests);
// router.post('/', createLeaveRequest);

// // Routes with different behavior based on user role
// router.put('/:id', updateLeaveRequest);
// router.delete('/:id', deleteLeaveRequest);

// // HR/admin specific routes
// router.put('/:id/status', updateLeaveStatus);
// router.put('/:id/comment', updateLeaveComment);

// // Employee specific routes
// router.get('/employee/:employeeId', getEmployeeLeaveRequests);


// export default router;

import express from 'express';
import {
  getLeaveRequests,
  createLeaveRequest,
  updateLeaveRequest,
  deleteLeaveRequest,
  updateLeaveStatus,
  updateLeaveComment,
  getEmployeeLeaveRequests,
  approveLeaveRequest,  // Add this
  rejectLeaveRequest    // Add this
} from '../controllers/leaveRequestController.js';

const router = express.Router();

// Routes for both HR/admin and employees
router.get('/', getLeaveRequests);
router.post('/', createLeaveRequest);

// Routes with different behavior based on user role
router.put('/:id', updateLeaveRequest);
router.delete('/:id', deleteLeaveRequest);

// HR/admin specific routes
router.put('/:id/status', updateLeaveStatus);
router.put('/:id/comment', updateLeaveComment);
router.put('/:id/approve', approveLeaveRequest);  // Add this route
router.put('/:id/reject', rejectLeaveRequest);    // Add this route

// Employee specific routes
router.get('/employee/:employeeId', getEmployeeLeaveRequests);

export default router;
