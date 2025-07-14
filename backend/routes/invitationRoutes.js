import express from 'express';
import { 
  createInvitation, 
  getInvitations, 
  resendInvitation, 
  cancelInvitation,
  validateInvitationToken 
} from '../controllers/invitationController.js';
import { authenticate, authorize } from '../middleware/companyAuth.js';

const router = express.Router();

// Validate invitation token (no auth required)
router.get('/validate', validateInvitationToken);

// Apply authentication middleware to protected routes
router.use(authenticate);

// Create a new invitation (admin only)
router.post('/', authorize(['manage_company_settings']), createInvitation);

// Get all invitations for a company (admin only)
router.get('/', authorize(['manage_company_settings']), getInvitations);

// Resend invitation (admin only)
router.post('/:invitationId/resend', authorize(['manage_company_settings']), resendInvitation);

// Cancel invitation (admin only)
router.delete('/:invitationId', authorize(['manage_company_settings']), cancelInvitation);

export default router;

// import express from 'express';
// import { 
//   createInvitation, 
//   getInvitations, 
//   resendInvitation, 
//   cancelInvitation,
//   validateInvitationToken 
// } from '../controllers/invitationController.js';
// import { authenticate, authorize } from '../middleware/companyAuth.js';

// const router = express.Router();

// // Apply authentication middleware to all routes
// router.use(authenticate);

// router.get('/validate', validateInvitationToken);

// // Create a new invitation (admin only)
// router.post('/', authorize(['manage_company_settings']), createInvitation);

// // Get all invitations for a company (admin only)
// router.get('/', authorize(['manage_company_settings']), getInvitations);

// // Resend invitation (admin only)
// router.post('/:invitationId/resend', authorize(['manage_company_settings']), resendInvitation);

// // Cancel invitation (admin only)
// router.delete('/:invitationId', authorize(['manage_company_settings']), cancelInvitation);

// export default router;
