// import mongoose from 'mongoose';

// const timeOffRequestSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   empId: { type: String, required: true },
//   userId: { type: String, required: true }, // Ensure userId is required
//   date: { type: Date, required: true },
//   day: { type: String, required: true },
//   checkIn: { type: String, required: true },
//   checkOut: { type: String, required: true },
//   inDate: { type: Date },
//   outDate: { type: Date },
//   shift: { 
//     type: String, 
//     enum: ['Morning', 'Evening', 'Night'],
//     required: true 
//   },
//   workType: { 
//     type: String, 
//     enum: ['On-Site', 'Remote', 'Hybrid'],
//     required: true 
//   },
//   minHour: { type: Number, required: true },
//   atWork: { type: Number, required: true },
//   overtime: { type: Number, default: 0 },
//   comment: { type: String },
//   status: { 
//     type: String, 
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending'
//   },
//   reviewedBy: { type: String }, // Add reviewer information
//   reviewComment: { type: String }, // Add review comment
//   reviewedAt: { type: Date } // Add review timestamp
// }, { timestamps: true });

// export default mongoose.model('TimeOffRequest', timeOffRequestSchema);


import mongoose from 'mongoose';

const timeOffRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  empId: { type: String, required: true },
  userId: { type: String, required: true }, // Ensure userId is required
  date: { type: Date, required: true },
  day: { type: String, required: true },
  checkIn: { type: String, required: true },
  checkOut: { type: String, required: true },
  inDate: { type: Date },
  outDate: { type: Date },
  shift: { 
    type: String, 
    enum: ['Morning', 'Evening', 'Night'],
    required: true 
  },
  workType: { 
    type: String, 
    enum: ['On-Site', 'Remote', 'Hybrid'],
    required: true 
  },
  minHour: { type: Number, required: true },
  atWork: { type: Number, required: true },
  overtime: { type: Number, default: 0 },
  comment: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  reviewedBy: { type: String }, // Add reviewer information
  reviewComment: { type: String }, // Add review comment
  reviewedAt: { type: Date } // Add review timestamp
}, { timestamps: true });

// Create model for TimeOffRequest in the main database (for backward compatibility)
const TimeOffRequest = mongoose.model('TimeOffRequest', timeOffRequestSchema);

// Export the schema for company-specific models
export { timeOffRequestSchema };

// Export the main model as default
export default TimeOffRequest;
