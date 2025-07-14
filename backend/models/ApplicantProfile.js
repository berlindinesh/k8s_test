// import mongoose from 'mongoose';

// const applicantProfileSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   position: String,
//   status: {
//     type: String,
//     enum: ['Hired', 'Not-Hired'],
//     default: 'Not-Hired',
//   },
//   color: {
//     type: String,
//     default: '#ff9800',
//   },
//   employeeId: {
//     type: String,
//     default: '',
//   },
// });

// const ApplicantProfile = mongoose.model('ApplicantProfile', applicantProfileSchema);

// export default ApplicantProfile


import mongoose from 'mongoose';

const applicantProfileSchema = new mongoose.Schema({
  name: String,
  email: String,
  position: String,
  status: {
    type: String,
    enum: ['Hired', 'Not-Hired'],
    default: 'Not-Hired',
  },
  color: {
    type: String,
    default: '#ff9800',
  },
  employeeId: {
    type: String,
    default: '',
  },
});

// Create model for ApplicantProfile in the main database (for backward compatibility)
const ApplicantProfile = mongoose.model('ApplicantProfile', applicantProfileSchema);

// Export the schema for company-specific models
export { applicantProfileSchema };

// Export the main model as default
export default ApplicantProfile;


