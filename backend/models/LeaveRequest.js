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
