import mongoose from 'mongoose';

const payslipSchema = new mongoose.Schema({
  employee: {
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
  grossPay: {
    type: Number,
    required: true
  },
  deduction: {
    type: Number,
    default: 0
  },
  netPay: {
    type: Number,
    required: true
  },
  batch: {
    type: String,
    default: 'None'
  },
  status: {
    type: String,
    enum: ['pending', 'processed', 'paid'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Payslip = mongoose.model('Payslip', payslipSchema);
export default Payslip;
