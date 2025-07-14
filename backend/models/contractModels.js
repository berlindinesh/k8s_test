import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  contractName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  wageType: { type: String, enum: ['Hourly', 'Monthly', 'Annually'], default: 'Monthly' },
  basicSalary: { type: Number, required: true },
  filingStatus: { type: String, enum: ['Single', 'Married', 'None'], default: 'None' },
  status: { type: String, enum: ['Active', 'Inactive', 'Pending'], default: 'Active' },
}, { timestamps: true });

const Contract = mongoose.model('Contract', contractSchema);
export default Contract
