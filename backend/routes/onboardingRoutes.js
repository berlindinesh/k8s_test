// import express from 'express';
// import {
//   getCandidates,
//   createCandidate,
//   updateCandidate,
//   deleteCandidate,
//   sendEmail,
//   filterByStage
// } from '../controllers/onboardingController.js';

// const router = express.Router();

// router.get('/', getCandidates);
// router.post('/', createCandidate);
// router.put('/:id', updateCandidate);
// router.delete('/:id', deleteCandidate);
// router.post('/send-email', sendEmail);
// router.get('/filter', filterByStage);

// export default router;


import express from 'express';
import {
  getCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
  sendEmail,
  filterByStage
} from '../controllers/onboardingController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.get('/', getCandidates);
router.post('/', createCandidate);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);
router.post('/send-email', sendEmail);
router.get('/filter', filterByStage);

export default router;
