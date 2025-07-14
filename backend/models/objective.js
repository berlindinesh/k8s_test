// import mongoose from 'mongoose';

// // Define a schema for key results
// const keyResultSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String },
//   targetValue: { type: String },
//   currentValue: { type: String, default: '0' },
//   unit: { type: String },
//   dueDate: { type: Date },
//   status: { 
//     type: String, 
//     enum: ['not-started', 'in-progress', 'completed'], 
//     default: 'not-started' 
//   },
//   progress: { type: Number, default: 0 }
// });

// const objectiveSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   managers: [{ type: String }], // Array of manager names as strings
//   keyResults: { type: Number, default: 0 },
//   keyResultsData: [keyResultSchema], // Array of key result objects
//   assignees: [{ type: String }], // Array of assignee names as strings
//   duration: { type: String, required: true },
//   description: { type: String, required: true },
//   archived: { type: Boolean, default: false },
//   objectiveType: { type: String, enum: ['self', 'all'], required: true },
//   progress: { type: Number, default: 0 },
//   status: { 
//     type: String, 
//     enum: ['not-started', 'in-progress', 'completed'], 
//     default: 'not-started' 
//   },
//   startDate: { type: Date, default: Date.now },
//   endDate: { type: Date },
//   priority: { 
//     type: String, 
//     enum: ['low', 'medium', 'high'], 
//     default: 'medium' 
//   },
//   userId: { type: String }, // Add this field to track the creator's userId
//   comments: [{
//     author: { type: String },
//     text: { type: String },
//     createdAt: { type: Date, default: Date.now }
//   }],
//   history: [{
//     action: { type: String },
//     user: { type: String },
//     timestamp: { type: Date, default: Date.now },
//     details: { type: String }
//   }]
// }, { timestamps: true });

// // Virtual property to get manager count
// objectiveSchema.virtual('managerCount').get(function() {
//   return this.managers.length;
// });

// // Virtual property to get assignee count
// objectiveSchema.virtual('assigneeCount').get(function() {
//   return this.assignees.length;
// });

// // Virtual property to calculate overall progress based on key results
// objectiveSchema.virtual('calculatedProgress').get(function() {
//   if (!this.keyResultsData || this.keyResultsData.length === 0) {
//     return this.progress;
//   }
  
//   const totalProgress = this.keyResultsData.reduce((sum, kr) => sum + kr.progress, 0);
//   return Math.round(totalProgress / this.keyResultsData.length);
// });

// // Method to update the status based on progress
// objectiveSchema.methods.updateStatus = function() {
//   const progress = this.calculatedProgress;
  
//   if (progress === 0) {
//     this.status = 'not-started';
//   } else if (progress === 100) {
//     this.status = 'completed';
//   } else {
//     this.status = 'in-progress';
//   }
  
//   this.progress = progress;
//   return this;
// };

// // Pre-save middleware to update status and progress
// objectiveSchema.pre('save', function(next) {
//   this.updateStatus();
//   next();
// });

// // Add a method to add a history entry
// objectiveSchema.methods.addHistoryEntry = function(action, user, details) {
//   this.history.push({
//     action,
//     user,
//     timestamp: new Date(),
//     details
//   });
//   return this;
// };

// // Make sure virtuals are included when converting to JSON
// objectiveSchema.set('toJSON', { virtuals: true });
// objectiveSchema.set('toObject', { virtuals: true });

// // Create model for Objective in the main database (for backward compatibility)
// const Objective = mongoose.model('Objective', objectiveSchema);

// // Export the schema for company-specific models
// export { objectiveSchema };

// // Export the main model as default
// export default Objective;

import mongoose from 'mongoose';

// Define a schema for key results
const keyResultSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  targetValue: { type: String },
  currentValue: { type: String, default: '0' },
  unit: { type: String },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['not-started', 'in-progress', 'completed'], 
    default: 'not-started' 
  },
  progress: { type: Number, default: 0 },
  completed: { type: Boolean, default: false } // Add this line for completed status
});

const objectiveSchema = new mongoose.Schema({
  title: { type: String, required: true },
  managers: [{ type: String }], // Array of manager names as strings
  keyResults: { type: Number, default: 0 },
  keyResultsData: [keyResultSchema], // Array of key result objects
  assignees: [{ type: String }], // Array of assignee names as strings
  duration: { type: String, required: true },
  description: { type: String, required: true },
  archived: { type: Boolean, default: false },
  objectiveType: { type: String, enum: ['self', 'all'], required: true },
  progress: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['not-started', 'in-progress', 'completed'], 
    default: 'not-started' 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high'], 
    default: 'medium' 
  },
  userId: { type: String }, // Add this field to track the creator's userId
  comments: [{
    author: { type: String },
    text: { type: String },
    createdAt: { type: Date, default: Date.now }
  }],
  history: [{
    action: { type: String },
    user: { type: String },
    timestamp: { type: Date, default: Date.now },
    details: { type: String }
  }]
}, { timestamps: true });

// Virtual property to get manager count
objectiveSchema.virtual('managerCount').get(function() {
  return this.managers.length;
});

// Virtual property to get assignee count
objectiveSchema.virtual('assigneeCount').get(function() {
  return this.assignees.length;
});

// Update the calculatedProgress virtual to use the completed field
objectiveSchema.virtual('calculatedProgress').get(function() {
  if (!this.keyResultsData || this.keyResultsData.length === 0) {
    return this.progress;
  }
  
  // Calculate progress based on completed key results
  const completedKeyResults = this.keyResultsData.filter(kr => kr.completed).length;
  return Math.round((completedKeyResults / this.keyResultsData.length) * 100);
});

// Update the updateStatus method to use the calculatedProgress
objectiveSchema.methods.updateStatus = function() {
  const progress = this.calculatedProgress;
  
  if (progress === 0) {
    this.status = 'not-started';
  } else if (progress === 100) {
    this.status = 'completed';
  } else {
    this.status = 'in-progress';
  }
  
  this.progress = progress;
  return this;
};

// Pre-save middleware to update status and progress
objectiveSchema.pre('save', function(next) {
  this.updateStatus();
  next();
});

// Add a method to add a history entry
objectiveSchema.methods.addHistoryEntry = function(action, user, details) {
  this.history.push({
    action,
    user,
    timestamp: new Date(),
    details
  });
  return this;
};

// Make sure virtuals are included when converting to JSON
objectiveSchema.set('toJSON', { virtuals: true });
objectiveSchema.set('toObject', { virtuals: true });

// Create model for Objective in the main database (for backward compatibility)
const Objective = mongoose.model('Objective', objectiveSchema);

// Export the schema for company-specific models
export { objectiveSchema };

// Export the main model as default
export default Objective;
