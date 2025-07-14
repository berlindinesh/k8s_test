// import mongoose from 'mongoose';

// const rotatingShiftSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     required: true // Add userId as a required field
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   employeeCode: {
//     type: String,
//     required: true
//   },
//   requestedShift: {
//     type: String,
//     required: true
//   },
//   currentShift: {
//     type: String,
//     required: true
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
//   // Keep isAllocated for backward compatibility
//   isAllocated: {
//     type: Boolean,
//     default: false
//   },
//   reviewedBy: String,
//   reviewedAt: Date,
//   reviewComment: String
// }, {
//   timestamps: true
// });

// export default mongoose.model('RotatingShift', rotatingShiftSchema);

import mongoose from 'mongoose';

const rotatingShiftSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true // Add userId as a required field
  },
  name: {
    type: String,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  },
  requestedShift: {
    type: String,
    required: true
  },
  currentShift: {
    type: String,
    required: true
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
  // Keep isAllocated for backward compatibility
  isAllocated: {
    type: Boolean,
    default: false
  },
  reviewedBy: String,
  reviewedAt: Date,
  reviewComment: String
}, {
  timestamps: true
});

// Create model for RotatingShift in the main database (for backward compatibility)
const RotatingShift = mongoose.model('RotatingShift', rotatingShiftSchema);

// Export the schema for company-specific models
export { rotatingShiftSchema };

// Export the main model as default
export default RotatingShift;
