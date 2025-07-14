import express from 'express';
import { 
  getUsersWithRoles, 
  updateUserRole, 
  updateUserPermissions 
} from '../controllers/roleController.js';
import { authenticate, authorize } from '../middleware/companyAuth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all users with roles (admin only)
router.get('/users', authorize(['manage_company_settings']), getUsersWithRoles);

// Update user role (admin only)
router.put('/users/:userId/role', authorize(['manage_company_settings']), updateUserRole);

// Update user permissions (admin only)
router.put('/users/:userId/permissions', authorize(['manage_company_settings']), updateUserPermissions);

export default router;

