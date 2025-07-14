// import mongoose from 'mongoose';

// // Candidate schema definition
// const candidateSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     department: { type: String, required: true },
//     column: { type: String, required: true },
//     stars: { type: Number, required: true },
//     recruitment: { type: String, required: true }, // Recruitment drive, e.g., 'Recruitment Drive'
//     employeeId: { type: String }, // Added field to store reference to registered employee
//   },
//   { timestamps: true } // Automatically add createdAt and updatedAt
// );

// const Candidate = mongoose.model('Candidate', candidateSchema);

// export default Candidate;


import mongoose from 'mongoose';

// Candidate schema definition
const candidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },
    column: { type: String, required: true },
    stars: { type: Number, required: true },
    recruitment: { type: String, required: true }, // Recruitment drive, e.g., 'Recruitment Drive'
    employeeId: { type: String }, // Added field to store reference to registered employee
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

// Create model for Candidate in the main database (for backward compatibility)
const Candidate = mongoose.model('Candidate', candidateSchema);

// Export the schema for company-specific models
export { candidateSchema };

// Export the main model as default
export default Candidate;
