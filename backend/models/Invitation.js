import mongoose from 'mongoose';

const invitationSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    enum: ['hr', 'manager', 'employee'],
    default: 'employee'
  },
  companyCode: {
    type: String,
    required: true
  },
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'expired', 'cancelled'],
    default: 'pending'
  },
  token: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastModified on save
invitationSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

const Invitation = mongoose.model('Invitation', invitationSchema);

export default Invitation;

// import mongoose from 'mongoose';

// const invitationSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   middleName: {
//     type: String,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'hr', 'manager', 'employee'],
//     default: 'employee'
//   },
//   companyCode: {
//     type: String,
//     required: true
//   },
//   invitedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'expired', 'cancelled'],
//     default: 'pending'
//   },
//   token: {
//     type: String,
//     required: true
//   },
//   expiresAt: {
//     type: Date,
//     required: true
//   },
//   acceptedAt: {
//     type: Date
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   lastModified: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Update lastModified on save
// invitationSchema.pre('save', function(next) {
//   this.lastModified = new Date();
//   next();
// });

// // Create model for Invitation in the main database
// const Invitation = mongoose.model('Invitation', invitationSchema);

// export default Invitation;

// import mongoose from 'mongoose';

// const invitationSchema = new mongoose.Schema({
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   middleName: {
//     type: String,
//     trim: true
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true
//   },
//   role: {
//     type: String,
//     enum: ['hr', 'manager', 'employee'],
//     default: 'employee'
//   },
//   companyCode: {
//     type: String,
//     required: true
//   },
//   invitedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'accepted', 'expired'],
//     default: 'pending'
//   },
//   token: {
//     type: String,
//     required: true
//   },
//   expiresAt: {
//     type: Date,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Create model for Invitation in the main database
// const Invitation = mongoose.model('Invitation', invitationSchema);

// export default Invitation;
