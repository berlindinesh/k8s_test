import express from 'express';
import { createInterview, getInterviews, updateInterview, deleteInterview } from '../controllers/interviewController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.post('/', createInterview);
router.get('/', getInterviews);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
