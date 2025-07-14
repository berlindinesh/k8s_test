// import mongoose from 'mongoose';

// const myLeaveRequestSchema = new mongoose.Schema({
//   employeeName: {
//     type: String,
//     required: true
//   },
//   employeeCode: {
//     type: String,
//     required: true
//   },
//   leaveType: {
//     type: String,
//     required: true,
//     enum: ['annual', 'sick', 'personal', 'maternity', 'paternity', 'casual', 'earned']
//   },
//   startDate: {
//     type: Date,
//     required: true
//   },
//   endDate: {
//     type: Date,
//     required: true
//   },
//   reason: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },
//   rejectionReason: String,
//   comment: String,
//   halfDay: {
//     type: Boolean,
//     default: false
//   },
//   halfDayType: {
//     type: String,
//     enum: ['morning', 'afternoon'],
//     default: 'morning'
//   },
//   numberOfDays: {
//     type: Number,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('MyLeaveRequest', myLeaveRequestSchema);

import mongoose from 'mongoose';

const myLeaveRequestSchema = new mongoose.Schema({
  employeeName: {
    type: String,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }, // Add this field
  leaveType: {
    type: String,
    required: true,
    enum: ['annual', 'sick', 'personal', 'maternity', 'paternity', 'casual', 'earned']
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  comment: String,
  halfDay: {
    type: Boolean,
    default: false
  },
  halfDayType: {
    type: String,
    enum: ['morning', 'afternoon'],
    default: 'morning'
  },
  numberOfDays: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Create model for MyLeaveRequest in the main database (for backward compatibility)
const MyLeaveRequest = mongoose.model('MyLeaveRequest', myLeaveRequestSchema);

// Export the schema for company-specific models
export { myLeaveRequestSchema };

// Export the main model as default
export default MyLeaveRequest;
