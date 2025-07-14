import express from 'express';
import {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  updateUserProfile,
  deleteUser,
  resetUserPassword
} from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all users (admin, hr can view)
router.get('/', authorize(['view_employees']), getUsers);

// Get single user (admin, hr can view)
router.get('/:userId', authorize(['view_employees']), getUser);

// Update user role (admin only)
router.put('/:userId/role', authorize(['manage_company_settings']), updateUserRole);

// Update user status (admin, hr can manage)
router.put('/:userId/status', authorize(['edit_employees']), updateUserStatus);

// Update user profile (admin, hr can edit)
router.put('/:userId/profile', authorize(['edit_employees']), updateUserProfile);

// Delete user (admin only)
router.delete('/:userId', authorize(['delete_employees']), deleteUser);

// Reset user password (admin, hr can reset)
router.post('/:userId/reset-password', authorize(['edit_employees']), resetUserPassword);

export default router;
