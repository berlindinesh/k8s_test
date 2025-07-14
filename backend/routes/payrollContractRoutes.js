import express from 'express';
import { 
  getContracts,
  getContractById,
  createContract, 
  updateContract,
  deleteContract,
  filterContracts,
  updateApprovalStatus,
  updateComplianceDocuments,
  terminateContract,
  getDashboardStats,
  renewContract,
  bulkUpdateContracts
} from '../controllers/payrollContractController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Basic CRUD routes
router.get('/', getContracts);
router.get('/dashboard', getDashboardStats);
router.get('/filter', filterContracts);
router.get('/:id', getContractById);
router.post('/', createContract);
router.put('/:id', updateContract);
router.delete('/:id', deleteContract);

// Advanced functionality routes
router.post('/:id/approval', updateApprovalStatus);
router.post('/:id/compliance', updateComplianceDocuments);
router.post('/:id/terminate', terminateContract);
router.post('/:id/renew', renewContract);
router.post('/bulk-update', bulkUpdateContracts);

export default router;
