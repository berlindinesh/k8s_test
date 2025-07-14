// // import mongoose from 'mongoose';

// // const leaveRequestSchema = new mongoose.Schema({
// //   type: {
// //     type: String,
// //     required: [true, 'Leave type is required'],
// //     enum: ['Annual Leave', 'Sick Leave', 'Maladie']
// //   },
// //   startDate: {
// //     type: Date,
// //     required: [true, 'Start date is required']
// //   },
// //   endDate: {
// //     type: Date,
// //     required: [true, 'End date is required']
// //   },
// //   days: {
// //     type: Number,
// //     required: [true, 'Number of days is required'],
// //     min: [1, 'Days must be at least 1']
// //   },
// //   status: {
// //     type: String,
// //     default: 'Pending',
// //     enum: ['Pending', 'Approved', 'Rejected']
// //   },
// //   comment: {
// //     type: String,
// //     default: ''
// //   },
// //   confirmation: {
// //     type: String,
// //     default: 'Pending',
// //     enum: ['Pending', 'Approved', 'Rejected']
// //   }
// // }, { timestamps: true });

// // leaveRequestSchema.pre('save', function(next) {
// //   if (this.startDate > this.endDate) {
// //     next(new Error('Start date cannot be after end date'));
// //   }
// //   const diffTime = Math.abs(this.endDate - this.startDate);
// //   this.days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
// //   next();
// // });

// // export default mongoose.model('LeaveRequest', leaveRequestSchema);

// import mongoose from 'mongoose';

// const leaveRequestSchema = new mongoose.Schema({
//   employeeId: {
//     type: String,
//     required: true
//   },
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
//     required: true
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
//   comment: {
//     type: String
//   },
//   rejectionReason: {
//     type: String
//   },
//   halfDay: {
//     type: Boolean,
//     default: false
//   },
//   halfDayType: {
//     type: String,
//     enum: ['morning', 'afternoon'],
//     default: 'morning'
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('LeaveRequest', leaveRequestSchema);

import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema({
  employeeId: {
    type: String,
    required: true
  },
  employeeName: {
    type: String,
    required: true
  },
  employeeCode: {
    type: String,
    required: true
  },
  leaveType: {
    type: String,
    required: true
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
  comment: {
    type: String
  },
  rejectionReason: {
    type: String
  },
  halfDay: {
    type: Boolean,
    default: false
  },
  halfDayType: {
    type: String,
    enum: ['morning', 'afternoon'],
    default: 'morning'
  }
}, {
  timestamps: true
});

export default mongoose.model('LeaveRequest', leaveRequestSchema);
