import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  candidate: { type: String, required: true },
  interviewer: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: 'Scheduled' },
});

// Create model for Interview in the main database (for backward compatibility)
const Interview = mongoose.model('Interview', interviewSchema);

// Export the schema for company-specific models
export { interviewSchema };

// Export the main model as default
export default Interview;
