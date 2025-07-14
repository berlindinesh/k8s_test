import { startTimesheetCleanupJob } from './timesheetCleanup.js';

// Start all scheduled jobs
export const startAllJobs = () => {
  console.log('Starting scheduled jobs...');
  startTimesheetCleanupJob();
  // Add other jobs here in the future
};

// Export individual job functions for manual execution
export { cleanupStaleTimesheets } from './timesheetCleanup.js';
