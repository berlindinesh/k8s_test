// import express from 'express';
// import { policyController } from '../controllers/policyController.js';

// const router = express.Router();

// router.get('/policies', policyController.getAllPolicies);
// router.post('/policies', policyController.createPolicy);
// router.put('/policies/:id', policyController.updatePolicy);
// router.delete('/policies/:id', policyController.deletePolicy);

// export default router;
 

import express from 'express';
import { policyController } from '../controllers/policyController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.get('/policies', policyController.getAllPolicies);
router.post('/policies', policyController.createPolicy);
router.put('/policies/:id', policyController.updatePolicy);
router.delete('/policies/:id', policyController.deletePolicy);

export default router;
