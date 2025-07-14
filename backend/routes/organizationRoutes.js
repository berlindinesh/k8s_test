// import express from 'express';
// import {
//   getOrganizationChart,
//   addPosition,
//   updatePosition,
//   deletePosition,
//   getAllPositions,
//   getPosition
// } from '../controllers/organizationController.js';

// const router = express.Router();

// // Get the entire organization chart
// router.get('/organization-chart', getOrganizationChart);

// // Get all positions (flat list)
// router.get('/positions', getAllPositions);

// // Get a single position
// router.get('/positions/:id', getPosition);

// // Add a new position
// router.post('/positions', addPosition);

// // Update a position
// router.put('/positions/:id', updatePosition);

// // Delete a position
// router.delete('/positions/:id', deletePosition);

// export default router;


import express from 'express';
import {
  getOrganizationChart,
  addPosition,
  updatePosition,
  deletePosition,
  getAllPositions,
  getPosition
} from '../controllers/organizationController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Define routes
router.get('/chart', getOrganizationChart);
router.get('/positions', getAllPositions);
router.get('/positions/:id', getPosition);
router.post('/positions', addPosition);
router.put('/positions/:id', updatePosition);
router.delete('/positions/:id', deletePosition);

export default router;
