// import mongoose from 'mongoose';

// // Define schema for history entries
// const historySchema = new mongoose.Schema({
//   date: { 
//     type: Date, 
//     default: Date.now,
//     required: true 
//   },
//   action: { 
//     type: String, 
//     required: true,
//     enum: ['Created', 'Updated', 'Comment', 'Response Submitted']
//   },
//   user: { 
//     type: String, 
//     required: true 
//   },
//   details: { 
//     type: String, 
//     required: true 
//   }
// }, { _id: false });

// // Define schema for response
// const responseSchema = new mongoose.Schema({
//   text: { 
//     type: String 
//   },
//   rating: { 
//     type: Number,
//     min: 1,
//     max: 5 
//   },
//   submittedBy: { 
//     type: String 
//   },
//   submittedAt: { 
//     type: Date,
//     default: Date.now 
//   }
// }, { _id: false });

// // Main feedback schema
// const feedbackSchema = new mongoose.Schema({
//   title: { 
//     type: String, 
//     required: true 
//   },
//   employee: { 
//     type: mongoose.Schema.Types.Mixed, 
//     required: true 
//   }, // Can be string or object with employee details
//   manager: { 
//     type: mongoose.Schema.Types.Mixed, 
//     required: true 
//   }, // Can be string or object with manager details
//   subordinates: String,
//   colleague: String,
//   period: { 
//     type: String, 
//     required: true 
//   },
//   // Add this field to the feedbackSchema
// reviewAssignedTo: { 
//   type: String 
// }, // Employee ID of the person assigned to review



//   employeeId: { 
//     type: String 
//   }, // Employee ID of the person receiving feedback
//   createdBy: { 
//     type: String 
//   }, // Employee ID of the person creating feedback
//   needsReview: { 
//     type: Boolean, 
//     default: false 
//   },
//   reviewStatus: { 
//     type: String, 
//     enum: ['Pending', 'Approved', 'Rejected'], 
//     default: 'Pending' 
//   },
//   originalFeedbackId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Feedback' 
//   }, // For linked feedback

//   startDate: { 
//     type: Date, 
//     required: true 
//   },
//   dueDate: { 
//     type: Date, 
//     required: true 
//   },
//   questionTemplate: { 
//     type: String, 
//     required: true 
//   },
//   keyResult: { 
//     type: String, 
//     required: true 
//   },
//   keyResults: [String], // Array of key results
//   status: {
//     type: String,
//     enum: ['Not Started', 'In Progress', 'Completed', 'Pending'],
//     default: 'Not Started'
//   },
//   feedbackType: {
//     type: String,
//     enum: ['selfFeedback', 'requestedFeedback', 'feedbackToReview', 'anonymousFeedback'],
//     required: true
//   },
//   priority: {
//     type: String,
//     enum: ['Low', 'Medium', 'High', 'Critical'],
//     default: 'Medium'
//   },
//   description: String,
//   response: responseSchema,
//   history: [historySchema]
// }, { timestamps: true });

// // Add a pre-save middleware to track history
// feedbackSchema.pre('save', function(next) {
//   if (this.isNew) {
//     if (!this.history) {
//       this.history = [];
//     }
    
//     this.history.push({
//       date: new Date(),
//       action: 'Created',
//       user: 'System', // In a real app, this would be the current user
//       details: 'Feedback created'
//     });
//   }
//   next();
// });

// // Add a method to add a comment to history
// feedbackSchema.methods.addComment = function(commentData) {
//   if (!this.history) {
//     this.history = [];
//   }
  
//   this.history.push({
//     date: new Date(),
//     action: 'Comment',
//     user: commentData.user || 'Anonymous',
//     details: commentData.comment
//   });
  
//   return this;
// };

// // Add a method to update status
// feedbackSchema.methods.updateStatus = function(newStatus, user) {
//   const oldStatus = this.status;
//   this.status = newStatus;
  
//   // Add to history if status changed
//   if (oldStatus !== newStatus) {
//     if (!this.history) {
//       this.history = [];
//     }
    
//     this.history.push({
//       date: new Date(),
//       action: 'Updated',
//       user: user || 'System',
//       details: `Status changed from ${oldStatus} to ${newStatus}`
//     });
//   }
  
//   return this;
// };

// export default mongoose.model('Feedback', feedbackSchema);

import mongoose from 'mongoose';

// Define schema for history entries
const historySchema = new mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  action: { 
    type: String, 
    required: true,
    enum: ['Created', 'Updated', 'Comment', 'Response Submitted']
  },
  user: { 
    type: String, 
    required: true 
  },
  details: { 
    type: String, 
    required: true 
  }
}, { _id: false });

// Define schema for response
const responseSchema = new mongoose.Schema({
  text: { 
    type: String 
  },
  rating: { 
    type: Number,
    min: 1,
    max: 5 
  },
  submittedBy: { 
    type: String 
  },
  submittedAt: { 
    type: Date,
    default: Date.now 
  }
}, { _id: false });

// Main feedback schema
const feedbackSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  employee: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }, // Can be string or object with employee details
  manager: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  }, // Can be string or object with manager details
  subordinates: String,
  colleague: String,
  period: { 
    type: String, 
    required: true 
  },
  // Add this field to the feedbackSchema
  reviewAssignedTo: { 
    type: String 
  }, // Employee ID of the person assigned to review

  employeeId: { 
    type: String 
  }, // Employee ID of the person receiving feedback
  createdBy: { 
    type: String 
  }, // Employee ID of the person creating feedback
  needsReview: { 
    type: Boolean, 
    default: false 
  },
  reviewStatus: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  originalFeedbackId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Feedback' 
  }, // For linked feedback

  startDate: { 
    type: Date, 
    required: true 
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  questionTemplate: { 
    type: String, 
    required: true 
  },
  keyResult: { 
    type: String, 
    required: true 
  },
  keyResults: [String], // Array of key results
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed', 'Pending'],
    default: 'Not Started'
  },
  feedbackType: {
    type: String,
    enum: ['selfFeedback', 'requestedFeedback', 'feedbackToReview', 'anonymousFeedback'],
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  description: String,
  response: responseSchema,
  history: [historySchema]
}, { timestamps: true });

// Add a pre-save middleware to track history
feedbackSchema.pre('save', function(next) {
  if (this.isNew) {
    if (!this.history) {
      this.history = [];
    }
    
    this.history.push({
      date: new Date(),
      action: 'Created',
      user: 'System', // In a real app, this would be the current user
      details: 'Feedback created'
    });
  }
  next();
});

// Add a method to add a comment to history
feedbackSchema.methods.addComment = function(commentData) {
  if (!this.history) {
    this.history = [];
  }
  
  this.history.push({
    date: new Date(),
    action: 'Comment',
    user: commentData.user || 'Anonymous',
    details: commentData.comment
  });
  
  return this;
};

// Add a method to update status
feedbackSchema.methods.updateStatus = function(newStatus, user) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Add to history if status changed
  if (oldStatus !== newStatus) {
    if (!this.history) {
      this.history = [];
    }
    
    this.history.push({
      date: new Date(),
      action: 'Updated',
      user: user || 'System',
      details: `Status changed from ${oldStatus} to ${newStatus}`
    });
  }
  
  return this;
};

// Create model for Feedback in the main database (for backward compatibility)
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Export the schema for company-specific models
export { feedbackSchema };

// Export the main model as default
export default Feedback;
