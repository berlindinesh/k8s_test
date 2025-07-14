import mongoose from 'mongoose';

const resignationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  position: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Approved', 'Requested', 'Rejected', 'Pending'],
    default: 'Requested'
  },
  description: { type: String, required: true },
  userId: { type: String, required: true }, // Make userId required
  reviewNotes: { type: String },
  reviewedBy: { type: String },
  reviewedAt: { type: Date }
}, { timestamps: true });

// Add an index on userId for faster queries
resignationSchema.index({ userId: 1 });

// Create model for Resignation in the main database (for backward compatibility)
const Resignation = mongoose.model('Resignation', resignationSchema);

// Export the schema for company-specific models
export { resignationSchema };

// Export the main model as default
export default Resignation;
