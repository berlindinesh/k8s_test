// import mongoose from 'mongoose';

// const rotatingWorktypeSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   employeeCode: {
//     type: String,
//     required: true
//   },
//   requestedWorktype: {
//     type: String,
//     required: true,
//     enum: ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Remote']
//   },
//   currentWorktype: {
//     type: String,
//     default: 'Regular'
//   },
//   requestedDate: {
//     type: Date,
//     required: true
//   },
//   requestedTill: {
//     type: Date,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending'
//   },
//   description: String,
//   isPermanentRequest: {
//     type: Boolean,
//     default: false
//   },
//   isForReview: {
//     type: Boolean,
//     default: true
//   },
//   // Add userId field to track request ownership
//   userId: {
//     type: String,
//     required: true
//   },
//   // Add reviewer information
//   reviewerName: {
//     type: String,
//     default: null
//   },
//   reviewedAt: {
//     type: Date,
//     default: null
//   },
//   // Add notification tracking
//   notificationSent: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('RotatingWorktype', rotatingWorktypeSchema);

import mongoose from 'mongoose';

const rotatingWorktypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  },
  requestedWorktype: {
    type: String,
    required: true,
    enum: ['Full Time', 'Part Time', 'Contract', 'Freelance', 'Remote']
  },
  currentWorktype: {
    type: String,
    default: 'Regular'
  },
  requestedDate: {
    type: Date,
    required: true
  },
  requestedTill: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  description: String,
  isPermanentRequest: {
    type: Boolean,
    default: false
  },
  isForReview: {
    type: Boolean,
    default: true
  },
  // Add userId field to track request ownership
  userId: {
    type: String,
    required: true
  },
  // Add reviewer information
  reviewerName: {
    type: String,
    default: null
  },
  reviewedAt: {
    type: Date,
    default: null
  },
  // Add notification tracking
  notificationSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create model for RotatingWorktype in the main database (for backward compatibility)
const RotatingWorktype = mongoose.model('RotatingWorktype', rotatingWorktypeSchema);

// Export the schema for company-specific models
export { rotatingWorktypeSchema };

// Export the main model as default
export default RotatingWorktype;
