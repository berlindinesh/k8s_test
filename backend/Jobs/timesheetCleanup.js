import cron from 'node-cron';
import getModelForCompany from '../models/genericModelFactory.js';
import { timesheetSchema } from '../models/Timesheet.js';
import Company from '../models/Company.js'; // Adjust path as needed

// Helper function to get all company codes
const getAllCompanyCodes = async () => {
  try {
    const companies = await Company.find({ status: 'active' }, 'companyCode');
    return companies.map(company => company.companyCode);
  } catch (error) {
    console.error('Error fetching company codes:', error);
    return [];
  }
};

// Cleanup function
const cleanupStaleTimesheets = async () => {
  console.log('Running timesheet cleanup job...');
  
  try {
    const companyCodes = await getAllCompanyCodes();
    let totalCleaned = 0;
    
    for (const companyCode of companyCodes) {
      try {
        const CompanyTimesheet = await getModelForCompany(companyCode, 'Timesheet', timesheetSchema);
        
        // Find timesheets that are active for more than 12 hours
        const staleTimesheets = await CompanyTimesheet.find({
          status: 'active',
          checkInTime: {
            $lt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
          }
        });

        for (const timesheet of staleTimesheets) {
          const checkInTime = new Date(timesheet.checkInTime);
          // Auto check-out after 8 hours from check-in
          const autoCheckOutTime = new Date(checkInTime.getTime() + (8 * 60 * 60 * 1000));
          
          timesheet.checkOutTime = autoCheckOutTime;
          timesheet.duration = 8 * 60 * 60; // 8 hours in seconds
          timesheet.status = 'completed';
          timesheet.autoCheckOut = true;
          
          await timesheet.save();
        }
        
        if (staleTimesheets.length > 0) {
          console.log(`Cleaned up ${staleTimesheets.length} stale sessions for company ${companyCode}`);
          totalCleaned += staleTimesheets.length;
        }
        
      } catch (companyError) {
        console.error(`Error cleaning up timesheets for company ${companyCode}:`, companyError);
      }
    }
    
    console.log(`Timesheet cleanup completed. Total cleaned: ${totalCleaned}`);
    
  } catch (error) {
    console.error('Timesheet cleanup job failed:', error);
  }
};

// Schedule the job to run every hour
const startTimesheetCleanupJob = () => {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', cleanupStaleTimesheets, {
    scheduled: true,
    timezone: "UTC" // Adjust timezone as needed
  });
  
  console.log('Timesheet cleanup job scheduled to run every hour');
};

export { startTimesheetCleanupJob, cleanupStaleTimesheets };
