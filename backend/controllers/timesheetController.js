import Timesheet, { timesheetSchema } from '../models/Timesheet.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Add this helper function at the top of the file
const checkAndHandleStaleSession = async (CompanyTimesheet, employeeId) => {
  const activeTimesheet = await CompanyTimesheet.findOne({
    employeeId,
    status: 'active'
  });

  if (activeTimesheet) {
    const now = new Date();
    const checkInTime = new Date(activeTimesheet.checkInTime);
    const hoursSinceCheckIn = (now - checkInTime) / (1000 * 60 * 60);

    // If check-in was more than 12 hours ago, auto check-out
    if (hoursSinceCheckIn > 12) {
      // Auto check-out with 8 hours duration (standard work day)
      const autoCheckOutTime = new Date(checkInTime.getTime() + (8 * 60 * 60 * 1000));
      const durationInSeconds = 8 * 60 * 60; // 8 hours in seconds

      activeTimesheet.checkOutTime = autoCheckOutTime;
      activeTimesheet.duration = durationInSeconds;
      activeTimesheet.status = 'completed';
      activeTimesheet.autoCheckOut = true; // Flag to indicate auto check-out
      
      await activeTimesheet.save();
      
      return {
        autoCheckedOut: true,
        message: 'Previous session was automatically checked out due to extended inactivity'
      };
    }
  }
  
  return { autoCheckedOut: false };
};
export const checkIn = async (req, res) => {
    try {
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        const { employeeId, employeeName } = req.body;
        
        if (!employeeId || !employeeName) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID and name are required'
            });
        }

        // Check for stale sessions and handle them
        const staleCheck = await checkAndHandleStaleSession(CompanyTimesheet, employeeId);
        
        // Check again for active sessions after handling stale ones
        const existingActiveTimesheet = await CompanyTimesheet.findOne({
            employeeId,
            status: 'active'
        });
 
        if (existingActiveTimesheet) {
            return res.status(400).json({ 
                message: 'Already checked in',
                checkInTime: existingActiveTimesheet.checkInTime
            });
        }
 
        const timesheet = await CompanyTimesheet.create({
            employeeId,
            employeeName,
            checkInTime: new Date()
        });

        const response = {
            ...timesheet.toObject(),
            checkInTime: timesheet.checkInTime
        };

        if (staleCheck.autoCheckedOut) {
            response.warning = staleCheck.message;
        }
 
        res.status(201).json(response);
    } catch (error) {
        console.error('Error during check-in:', error);
        res.status(500).json({ 
            error: 'Error during check-in', 
            message: error.message
        });
    }
};

export const checkOut = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Processing check-out for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId, duration } = req.body;
        
        if (!employeeId) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID is required'
            });
        }
        
        const timesheet = await CompanyTimesheet.findOne({
            employeeId,
            status: 'active'
        });

        if (!timesheet) {
            return res.status(400).json({ message: 'No active check-in found' });
        }

        const checkOutTime = new Date();
        timesheet.checkOutTime = checkOutTime;
        
        // Calculate duration in seconds if not provided
        if (!duration) {
            const checkInTime = new Date(timesheet.checkInTime);
            const durationInSeconds = Math.floor((checkOutTime - checkInTime) / 1000);
            timesheet.duration = durationInSeconds;
        } else {
            timesheet.duration = duration;
        }
        
        timesheet.status = 'completed';
        await timesheet.save();

        res.json(timesheet);
    } catch (error) {
        console.error('Error during check-out:', error);
        res.status(500).json({ 
            error: 'Error during check-out', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Add new force check-in function
export const forceCheckIn = async (req, res) => {
    try {
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        const { employeeId, employeeName } = req.body;
        
        // Find and auto-complete any active sessions
        const activeTimesheet = await CompanyTimesheet.findOne({
            employeeId,
            status: 'active'
        });

        if (activeTimesheet) {
            const now = new Date();
            const checkInTime = new Date(activeTimesheet.checkInTime);
            const durationInSeconds = Math.floor((now - checkInTime) / 1000);

            activeTimesheet.checkOutTime = now;
            activeTimesheet.duration = durationInSeconds;
            activeTimesheet.status = 'completed';
            activeTimesheet.autoCheckOut = true;
            
            await activeTimesheet.save();
        }

        // Create new check-in
        const newTimesheet = await CompanyTimesheet.create({
            employeeId,
            employeeName,
            checkInTime: new Date()
        });

        res.status(201).json({
            ...newTimesheet.toObject(),
            message: activeTimesheet ? 'Previous session auto-completed and new session started' : 'Check-in successful'
        });

    } catch (error) {
        console.error('Error during force check-in:', error);
        res.status(500).json({ 
            error: 'Error during force check-in', 
            message: error.message
        });
    }
};


// Get today's timesheet
export const getTodayTimesheet = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching today's timesheet for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId } = req.query;
        
        if (!employeeId) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID is required'
            });
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
 
        const timesheet = await CompanyTimesheet.findOne({
            employeeId,
            checkInTime: { $gte: today }
        }).sort({ checkInTime: -1 });
 
        res.json({ timesheet });
    } catch (error) {
        console.error('Error fetching today\'s timesheet:', error);
        res.status(500).json({ 
            error: 'Error fetching today\'s timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Get weekly timesheets
export const getWeeklyTimesheets = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching weekly timesheets for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId } = req.query;
        
        if (!employeeId) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID is required'
            });
        }
        
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
 
        const timesheets = await CompanyTimesheet.find({
            employeeId,
            checkInTime: { $gte: startOfWeek }
        }).sort({ checkInTime: -1 });
 
        res.json({ timesheets });
    } catch (error) {
        console.error('Error fetching weekly timesheets:', error);
        res.status(500).json({ 
            error: 'Error fetching weekly timesheets', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Get all timesheets
export const getAllTimesheets = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching all timesheets for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        // Support filtering by employee ID if provided
        const { employeeId } = req.query;
        const filter = employeeId ? { employeeId } : {};
        
        const timesheets = await CompanyTimesheet.find(filter).sort({ checkInTime: -1 });
        res.json(timesheets);
    } catch (error) {
        console.error('Error fetching all timesheets:', error);
        res.status(500).json({ 
            error: 'Error fetching all timesheets', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Get timesheet by ID
export const getTimesheetById = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Invalid request', 
                message: 'Timesheet ID is required' 
            });
        }
        
        console.log(`Fetching timesheet ${id} for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const timesheet = await CompanyTimesheet.findById(id);
        
        if (!timesheet) {
            return res.status(404).json({ 
                error: 'Timesheet not found',
                message: `No timesheet found with ID: ${id}`
            });
        }
        
        res.json(timesheet);
    } catch (error) {
        console.error(`Error fetching timesheet ${req.params.id}:`, error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided timesheet ID is not valid'
            });
        }
        
        res.status(500).json({ 
            error: 'Error fetching timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Update timesheet
export const updateTimesheet = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Invalid request', 
                message: 'Timesheet ID is required' 
            });
        }
        
        console.log(`Updating timesheet ${id} for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const timesheet = await CompanyTimesheet.findByIdAndUpdate(
            id,
            req.body,
            { 
                new: true,
                runValidators: true // This ensures validation runs on update
            }
        );
        
        if (!timesheet) {
            return res.status(404).json({ 
                error: 'Timesheet not found',
                message: `No timesheet found with ID: ${id}`
            });
        }
        
        res.json(timesheet);
    } catch (error) {
        console.error(`Error updating timesheet ${req.params.id}:`, error);
        
        // Handle specific MongoDB errors
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: 'Validation error',
                message: error.message,
                details: Object.values(error.errors).map(err => err.message)
            });
        }
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided timesheet ID is not valid'
            });
        }
        
        res.status(500).json({ 
            error: 'Error updating timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
 
// Delete timesheet
export const deleteTimesheet = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: 'Invalid request', 
                message: 'Timesheet ID is required' 
            });
        }
        
        console.log(`Deleting timesheet ${id} for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const timesheet = await CompanyTimesheet.findByIdAndDelete(id);
        
        if (!timesheet) {
            return res.status(404).json({ 
                error: 'Timesheet not found',
                message: `No timesheet found with ID: ${id}`
            });
        }
        
                res.json({ 
            message: 'Timesheet deleted successfully',
            deletedTimesheet: {
                id: timesheet._id,
                employeeId: timesheet.employeeId,
                employeeName: timesheet.employeeName
            }
        });
    } catch (error) {
        console.error(`Error deleting timesheet ${req.params.id}:`, error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided timesheet ID is not valid'
            });
        }
        
        res.status(500).json({ 
            error: 'Error deleting timesheet', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get employee timesheets by date range
export const getTimesheetsByDateRange = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching timesheets by date range for company: ${companyCode}`);
        
        // Get company-specific Timesheet model
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        const { employeeId, startDate, endDate } = req.query;
        
        if (!employeeId || !startDate || !endDate) {
            return res.status(400).json({
                error: 'Validation error',
                message: 'Employee ID, start date, and end date are required'
            });
        }
        
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        
        const timesheets = await CompanyTimesheet.find({
            employeeId,
            checkInTime: { $gte: start, $lte: end }
        }).sort({ checkInTime: -1 });
        
        res.json(timesheets);
    } catch (error) {
        console.error('Error fetching timesheets by date range:', error);
        res.status(500).json({ 
            error: 'Error fetching timesheets by date range', 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
