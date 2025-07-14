// import mongoose from 'mongoose';

// const policySchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.model('Policy', policySchema);


import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create model for Policy in the main database (for backward compatibility)
const Policy = mongoose.model('Policy', policySchema);

// Export the schema for company-specific models
export { policySchema };

// Export the main model as default
export default Policy;
