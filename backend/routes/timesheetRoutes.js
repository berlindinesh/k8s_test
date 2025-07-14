import express from 'express';
import {
    checkIn,
    checkOut,
    forceCheckIn,
    getTodayTimesheet,
    getWeeklyTimesheets,
    getAllTimesheets,
    getTimesheetById,
    updateTimesheet,
    deleteTimesheet,
    getTimesheetsByDateRange
} from '../controllers/timesheetController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Check-in and check-out routes
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

// Add the new route
router.post('/force-check-in', forceCheckIn);


// Get timesheets
router.get('/today', getTodayTimesheet);
router.get('/weekly', getWeeklyTimesheets);
router.get('/date-range', getTimesheetsByDateRange);
router.get('/', getAllTimesheets);
router.get('/:id', getTimesheetById);

// Update and delete timesheets
router.put('/:id', updateTimesheet);
router.delete('/:id', deleteTimesheet);

export default router;
