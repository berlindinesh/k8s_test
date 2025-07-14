import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  companyCode: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^\d{6}$/.test(v);
        },
        message: props => 'Zip code must be exactly 6 digits'
      }
    }
  },
  
  contactEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address']
  },
  contactPhone: {
    type: String,
    trim: true,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => 'Phone number must be exactly 10 digits'
    }
  },
  
  logo: {
    type: String, // URL to company logo
    required: true
  },
  industry: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    leavePolicy: {
      casualLeavePerYear: { type: Number, default: 12 },
      sickLeavePerYear: { type: Number, default: 12 },
      earnedLeavePerYear: { type: Number, default: 12 }
    },
    workingHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  adminUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  registrationNumber: {
    type: String,
    required: true,
    default: function() {
      // Generate a unique value, e.g., using company code and timestamp
      return `REG-${this.companyCode}-${Date.now()}`;
    },
    unique: true
  },
  pendingVerification: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
});

const Company = mongoose.model('Company', companySchema);

export { companySchema };
export default Company;