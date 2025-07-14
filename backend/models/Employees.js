// models/Employee.js
import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  jobPosition: { type: String, required: true },
  mobile: { type: String, required: true },
  joiningDate: { type: Date, required: true },
  stage: { type: String, required: true, enum: ['Test', 'Interview', 'Offer'] },
});

const Employees = mongoose.model('Employees', employeeSchema);

export default Employees;