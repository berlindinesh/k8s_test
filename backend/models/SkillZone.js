// // import mongoose from 'mongoose';

// // // Candidate schema
// // const candidateSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true
// //   },
// //   reason: {
// //     type: String,
// //     required: true
// //   },
// //   addedOn: {
// //     type: String,
// //     required: true
// //   },
// //   // Employee reference fields with proper definitions
// //   employeeId: {
// //     type: String,
// //     default: null
// //   },
// //   email: {
// //     type: String,
// //     default: null
// //   },
// //   department: {
// //     type: String,
// //     default: null
// //   },
// //   designation: {
// //     type: String,
// //     default: null
// //   }
// // });

// // // SkillZone schema
// // const skillZoneSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true,
// //   },
// //   candidates: [candidateSchema], // Array of candidates
// // });

// // // Create model for SkillZone
// // const SkillZone = mongoose.model('SkillZone', skillZoneSchema);

// // export default SkillZone;

// import mongoose from 'mongoose';

// // Candidate schema
// const candidateSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   reason: {
//     type: String,
//     required: true
//   },
//   addedOn: {
//     type: String,
//     required: true
//   },
//   // Employee reference fields with proper definitions
//   employeeId: {
//     type: String,
//     default: null
//   },
//   email: {
//     type: String,
//     default: null
//   },
//   department: {
//     type: String,
//     default: null
//   },
//   designation: {
//     type: String,
//     default: null
//   }
// });

// // SkillZone schema
// const skillZoneSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   candidates: [candidateSchema], // Array of candidates
// });

// // Create model for SkillZone in the main database (for backward compatibility)
// const SkillZone = mongoose.model('SkillZone', skillZoneSchema);

// // Export the schema for company-specific models
// export { skillZoneSchema };

// // Export the main model as default
// export default SkillZone;

import mongoose from 'mongoose';

// Candidate schema
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  addedOn: {
    type: String,
    required: true
  },
  // Employee reference fields with proper definitions
  employeeId: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  department: {
    type: String,
    default: null
  },
  designation: {
    type: String,
    default: null
  }
});

// SkillZone schema
const skillZoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  candidates: [candidateSchema], // Array of candidates
});

// Create model for SkillZone in the main database (for backward compatibility)
const SkillZone = mongoose.model('SkillZone', skillZoneSchema);

// Export the schema for company-specific models
export { skillZoneSchema };

// Export the main model as default
export default SkillZone;
