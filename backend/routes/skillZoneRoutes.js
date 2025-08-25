import express from 'express';
import {
  getAllSkills,
  addSkill,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  deleteSkill
} from '../controllers/skillZoneController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all skills
router.get('/skill-zone', getAllSkills);

// Add a new skill
router.post('/skill-zone', addSkill);

// Add a candidate to a skill
router.post('/skill-zone/:skillId/candidates', addCandidate);

// Update a candidate in a skill
router.put('/skill-zone/:skillId/candidates/:candidateId', updateCandidate);

// Delete a candidate from a skill
router.delete('/skill-zone/:skillId/candidates/:candidateId', deleteCandidate);

// Delete a skill
router.delete('/skill-zone/:skillId', deleteSkill);

export default router;
