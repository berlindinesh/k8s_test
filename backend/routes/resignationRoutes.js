import express from 'express';
import {
  createResignation,
  getAllResignations,
  getResignationsByUser,
  updateResignation,
  deleteResignation,
  sendEmail,
} from '../controllers/resignationController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Middleware to check if user is admin or HR (implement this)
const isAdminOrHR = (req, res, next) => {
  const userRole = req.headers['user-role'];
  if (userRole && (userRole.includes('admin') || userRole.includes('hr'))) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin or HR role required' });
  }
};

// Middleware to check if user is accessing their own data
const isOwnerOrAdmin = async (req, res, next) => {
  const userId = req.headers['user-id'];
  const userRole = req.headers['user-role'];
  
  // Admin or HR can access any data
  if (userRole && (userRole.includes('admin') || userRole.includes('hr'))) {
    return next();
  }
  
  // For resignation-specific endpoints
  if (req.params.id) {
    try {
      // Get company-specific Resignation model
      const companyCode = req.companyCode;
      const CompanyResignation = await getModelForCompany(companyCode, 'Resignation', resignationSchema);
      
      const resignation = await CompanyResignation.findById(req.params.id);
      if (!resignation) {
        return res.status(404).json({ message: 'Resignation not found' });
      }
      
      if (resignation.userId === userId) {
        return next();
      } else {
        return res.status(403).json({ message: 'Access denied: Not authorized to access this resignation' });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
  
  next();
};

router.post('/', createResignation);
router.get('/', getAllResignations); // Ideally should be restricted to admin/HR
router.get('/user/:userId', getResignationsByUser);
router.put('/:id', updateResignation);
router.delete('/:id', deleteResignation);
router.post('/email', sendEmail);

export default router;
