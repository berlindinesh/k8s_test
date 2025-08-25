import express from 'express';
import {
  addCandidate,
  getCandidatesByRecruitment,
  updateCandidate,
  deleteCandidate,
} from '../controllers/candidateController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Route to add a new candidate
router.post('/recruitment', addCandidate);

// Route to get candidates by recruitment type (e.g., 'Recruitment Drive')
router.get('/recruitment/:recruitment', getCandidatesByRecruitment);

// Route to update a candidate's details
router.put('/recruitment/:id', updateCandidate);

// Route to delete a candidate
router.delete('/recruitment/:id', deleteCandidate);

export default router;
