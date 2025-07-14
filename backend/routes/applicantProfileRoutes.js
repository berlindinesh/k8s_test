// // routes/applicantProfileRoutes.js
// import express from 'express'
// import { getAllApplicantProfiles, 
//     createApplicantProfile,
//     deleteApplicantProfile,
//     batchDeleteApplicantProfiles} from '../controllers/applicantProfileController.js';

// const router = express.Router();

// router.get('/',getAllApplicantProfiles);
// router.post('/',createApplicantProfile);
// router.delete('/:id',deleteApplicantProfile);
// router.delete('/batch',batchDeleteApplicantProfiles);

// export default router



import express from 'express';
import { 
  getAllApplicantProfiles, 
  createApplicantProfile,
  deleteApplicantProfile,
  batchDeleteApplicantProfiles
} from '../controllers/applicantProfileController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.get('/', getAllApplicantProfiles);
router.post('/', createApplicantProfile);
router.delete('/:id', deleteApplicantProfile);
router.delete('/batch', batchDeleteApplicantProfiles);

export default router;


