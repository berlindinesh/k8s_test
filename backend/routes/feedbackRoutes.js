// import express from 'express';
// import {
//   createFeedback,
//   getAllFeedbacks,
//   updateFeedback,
//   deleteFeedback,
//   getFeedbacksByType,
//   getFeedbackHistory,
//   addFeedbackComment,
//   getFeedbackAnalytics,
//   submitFeedbackResponse,
//   getFeedbacksByEmployee,
//   getFeedbacksByDepartment,
//   getFeedbacksOverdue,
//   getFeedbacksDueThisWeek,
//   bulkUpdateFeedbacks,
//   bulkDeleteFeedbacks,
//   getFeedbacksByUserId,           
//   updateFeedbackReviewStatus,   
//   completeFeedbackReview,
//   getLinkedFeedback,
//   getFeedbacksToReviewByUser,
//   assignFeedbackForReview,
//   getFeedbackStatsByUser
// } from '../controllers/feedbackController.js';

// const router = express.Router();

// // Basic CRUD routes
// router.post('/', createFeedback);
// router.get('/', getAllFeedbacks);
// router.put('/:id', updateFeedback);
// router.delete('/:id', deleteFeedback);

// // Feedback type routes
// router.get('/type/:type', getFeedbacksByType);

// // Enhanced feature routes
// router.get('/:id/history', getFeedbackHistory);
// router.post('/:id/comments', addFeedbackComment);
// router.get('/analytics/summary', getFeedbackAnalytics);

// // Response submission
// router.post('/:id/response', submitFeedbackResponse);

// // Employee and department specific routes
// router.get('/employee/:employeeId', getFeedbacksByEmployee);
// router.get('/department/:department', getFeedbacksByDepartment);

// // Due date related routes
// router.get('/due/overdue', getFeedbacksOverdue);
// router.get('/due/this-week', getFeedbacksDueThisWeek);

// // Bulk operations
// router.put('/bulk/update', bulkUpdateFeedbacks);
// router.delete('/bulk/delete', bulkDeleteFeedbacks);



// // Add these new routes
// router.get('/user/:userId', getFeedbacksByUserId);
// router.put('/:id/review', updateFeedbackReviewStatus);


// // Add this route at the end of your routes
// router.post('/:id/complete-review', completeFeedbackReview);
// router.get('/:id/linked', getLinkedFeedback);
// router.get('/to-review/:userId', getFeedbacksToReviewByUser);
// router.put('/:id/assign', assignFeedbackForReview);
// router.get('/stats/:userId', getFeedbackStatsByUser);



// export default router;

import express from 'express';
import {
  createFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
  getFeedbacksByType,
  getFeedbackHistory,
  addFeedbackComment,
  getFeedbackAnalytics,
  submitFeedbackResponse,
  getFeedbacksByEmployee,
  getFeedbacksByDepartment,
  getFeedbacksOverdue,
  getFeedbacksDueThisWeek,
  bulkUpdateFeedbacks,
  bulkDeleteFeedbacks,
  getFeedbacksByUserId,           
  updateFeedbackReviewStatus,   
  completeFeedbackReview,
  getLinkedFeedback,
  getFeedbacksToReviewByUser,
  assignFeedbackForReview,
  getFeedbackStatsByUser
} from '../controllers/feedbackController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Basic CRUD routes
router.post('/', createFeedback);
router.get('/', getAllFeedbacks);
router.put('/:id', updateFeedback);
router.delete('/:id', deleteFeedback);

// Feedback type routes
router.get('/type/:type', getFeedbacksByType);

// Enhanced feature routes
router.get('/:id/history', getFeedbackHistory);
router.post('/:id/comments', addFeedbackComment);
router.get('/analytics/summary', getFeedbackAnalytics);

// Response submission
router.post('/:id/response', submitFeedbackResponse);

// Employee and department specific routes
router.get('/employee/:employeeId', getFeedbacksByEmployee);
router.get('/department/:department', getFeedbacksByDepartment);

// Due date related routes
router.get('/due/overdue', getFeedbacksOverdue);
router.get('/due/this-week', getFeedbacksDueThisWeek);

// Bulk operations
router.put('/bulk/update', bulkUpdateFeedbacks);
router.delete('/bulk/delete', bulkDeleteFeedbacks);

// User-specific routes
router.get('/user/:userId', getFeedbacksByUserId);
router.put('/:id/review', updateFeedbackReviewStatus);
router.post('/:id/complete-review', completeFeedbackReview);
router.get('/:id/linked', getLinkedFeedback);
router.get('/to-review/:userId', getFeedbacksToReviewByUser);
router.put('/:id/assign', assignFeedbackForReview);
router.get('/stats/:userId', getFeedbackStatsByUser);

export default router;
