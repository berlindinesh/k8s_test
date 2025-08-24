import express from 'express';
import {
  getUserNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications
} from '../controllers/notificationController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get notifications for a user
router.get('/user/:userId', getUserNotifications);

// Create a new notification
router.post('/', createNotification);

// Mark a notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read for a user
router.put('/user/:userId/read-all', markAllAsRead);

// Delete a notification
router.delete('/:id', deleteNotification);

// Clear all notifications for a user
router.delete('/user/:userId/clear-all', clearAllNotifications);

export default router;
