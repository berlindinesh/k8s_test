import mongoose from 'mongoose';
 
const timesheetSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  checkInTime: {
    type: Date,
    required: true
  },
  checkOutTime: {
    type: Date
  },
  duration: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
   autoCheckOut: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create model for Timesheet in the main database (for backward compatibility)
const Timesheet = mongoose.model('Timesheet', timesheetSchema);

// Export the schema for company-specific models
export { timesheetSchema };

// Export the main model as default
export default Timesheet;
