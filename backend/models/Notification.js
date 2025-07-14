// import mongoose from 'mongoose';

// const notificationSchema = new mongoose.Schema({
//   message: {
//     type: String,
//     required: true
//   },
//   time: {
//     type: Date,
//     default: Date.now
//   },
//   type: {
//     type: String,
//     default: 'info'
//   },
//   read: {
//     type: Boolean,
//     default: false
//   },
//   status: {
//     type: String,
//     default: null
//   },
//   userId: {
//     type: String,
//     required: true
//   }
// }, {
//   timestamps: true
// });

// export default mongoose.model('Notification', notificationSchema);

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    default: 'info'
  },
  read: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: null
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create model for Notification in the main database (for backward compatibility)
const Notification = mongoose.model('Notification', notificationSchema);

// Export the schema for company-specific models
export { notificationSchema };

// Export the main model as default
export default Notification;
