import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import createCompanyModel from './modelFactory.js';

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  middleName: {
    type: String,
    trim: true,
    default: ''
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: ['admin', 'hr', 'manager', 'employee'],
    default: 'employee'
  },
  companyCode: {
    type: String,
    required: true,
    index: true
  },
  permissions: [{
    type: String,
    enum: [
      'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
      'view_payroll', 'manage_payroll',
      'view_leave', 'approve_leave', 'manage_leave_policy',
      'view_attendance', 'manage_attendance',
      'view_reports', 'create_reports',
      'manage_company_settings'
    ]
  }],
  // NEW FIELDS FOR INVITATION TRACKING
  isFirstLogin: {
    type: Boolean,
    default: false
  },
  invitationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invitation'
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  },
  // EXISTING FIELDS
  otp: String,
  otpExpires: Date,
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: {
    type: Boolean,
    default: true
  },
  resetPasswordToken: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastModified on save
userSchema.pre('save', function(next) {
  if (!this.isModified('lastModified')) {
    this.lastModified = new Date();
  }
  next();
});

// Existing pre-save middleware for userId generation
userSchema.pre('save', async function(next) {
  // Only generate userId if it's a new user AND userId is not already set
  if (this.isNew && !this.userId) {
    try {
      // Extract domain from email
      const emailParts = this.email.split('@');
      const domain = emailParts[1].split('.')[0];
      
      // Generate base for userId using first letter of first name, first letter of last name, and domain
      const baseId = `${this.firstName.charAt(0)}${this.lastName.charAt(0)}-${domain}`.toUpperCase();
      
      // Find the count of existing users with similar userId pattern and same company code
      const UserModel = await getUserModel(this.companyCode);
      const count = await UserModel.countDocuments({
        userId: new RegExp(`^${baseId}`),
        companyCode: this.companyCode
      });
      
      // Create userId with sequential number
      this.userId = `${baseId}-${(count + 1).toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating userId:', error);
      // Fallback userId generation
      this.userId = `USER-${Date.now()}`;
    }
  }
  next();
});

// Hash password before saving - FIXED VERSION
userSchema.pre('save', async function(next) {
  // Skip if password is not modified
  if (!this.isModified('password')) {
    return next();
  }
  
  // Skip middleware if flag is set
  if (this.$skipMiddleware) {
    return next();
  }
  
  try {
    // Check if password is already hashed to prevent double hashing
    if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
      console.log('Password appears to be already hashed, skipping hashing for:', this.email);
      return next();
    }
    
    console.log('Hashing password for user:', {
      email: this.email,
      companyCode: this.companyCode,
      passwordLength: this.password.length,
      passwordPreview: this.password.substring(0, 3) + '...'
    });
    
    // Hash the password
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    console.log(`Password hashed successfully. New length: ${this.password.length}`);
    
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    console.log('Comparing password for user:', this.email);
    console.log('Candidate password length:', candidatePassword.length);
    console.log('Stored password length:', this.password.length);
    console.log('Stored password starts with hash:', this.password.startsWith('$2'));
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Method to assign permissions based on role
userSchema.methods.assignPermissions = function() {
  switch(this.role) {
    case 'admin':
      this.permissions = [
        'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
        'view_payroll', 'manage_payroll',
        'view_leave', 'approve_leave', 'manage_leave_policy',
        'view_attendance', 'manage_attendance',
        'view_reports', 'create_reports',
        'manage_company_settings'
      ];
      break;
    case 'hr':
      this.permissions = [
        'view_employees', 'edit_employees', 'create_employees',
        'view_payroll', 'manage_payroll',
        'view_leave', 'approve_leave', 'manage_leave_policy',
        'view_attendance', 'manage_attendance',
        'view_reports', 'create_reports'
      ];
      break;
    case 'manager':
      this.permissions = [
        'view_employees',
        'view_leave', 'approve_leave',
        'view_attendance',
        'view_reports'
      ];
      break;
    case 'employee':
      this.permissions = [
        'view_leave'
      ];
      break;
  }
};

// Static method to create user without password hashing (for invitations)
userSchema.statics.createWithPlainPassword = async function(userData, plainPassword) {
  const user = new this(userData);
  
  // Set flag to skip password hashing middleware
  user.$skipMiddleware = true;
  
  // Hash password manually
  const saltRounds = 10;
  user.password = await bcrypt.hash(plainPassword, saltRounds);
  
  return user;
};

// This model will be in the main database for global user authentication
const MainUser = mongoose.model('User', userSchema);

// Function to get User model for a specific company
const getUserModel = async (companyCode) => {
  if (!companyCode) {
    throw new Error('Company code is required to get user model');
  }
  
  try {
    const model = await createCompanyModel(companyCode, 'User', userSchema);
    return model;
  } catch (error) {
    console.error(`Error getting User model for company ${companyCode}:`, error);
    throw error;
  }
};

// Add these methods to your User model schema
userSchema.statics.generatePassword = function() {
  const length = 10;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

userSchema.methods.setPassword = function(password) {
  // This method should set the password (it will be hashed by the pre-save hook)
  this.password = password;
};

userSchema.statics.createFromInvitation = async function(invitation, password) {
  // Create the full name from first, middle, and last name
  const fullName = `${invitation.firstName}${invitation.middleName ? ' ' + invitation.middleName : ''} ${invitation.lastName}`;
  
  const user = new this({
    firstName: invitation.firstName,
    middleName: invitation.middleName || '',
    lastName: invitation.lastName,
    // Add the name field - this was missing
    name: fullName,
    email: invitation.email.toLowerCase(),
    // Add the password field directly - this was missing
    password: password, // Will be hashed by pre-save hook
    role: invitation.role,
    companyCode: invitation.companyCode,
    isVerified: true,
    isActive: true
  });
  
  await user.save();
  return user;
};

export { userSchema, getUserModel };
export default MainUser;


// import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
// import createCompanyModel from './modelFactory.js';

// const userSchema = new mongoose.Schema({
//   userId: {
//     type: String,
//     unique: true,
//   },
//   firstName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   middleName: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   lastName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   name: {
//     type: String,
//     required: true
//   },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     trim: true,
//     lowercase: true
//   },
//   password: { 
//     type: String, 
//     required: true 
//   },
//   role: {
//     type: String,
//     enum: ['admin', 'hr', 'manager', 'employee'],
//     default: 'employee'
//   },
//   companyCode: {
//     type: String,
//     required: true,
//     index: true
//   },
//   permissions: [{
//     type: String,
//     enum: [
//       'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
//       'view_payroll', 'manage_payroll',
//       'view_leave', 'approve_leave', 'manage_leave_policy',
//       'view_attendance', 'manage_attendance',
//       'view_reports', 'create_reports',
//       'manage_company_settings'
//     ]
//   }],
//   otp: String,
//   otpExpires: Date,
//   isVerified: { 
//     type: Boolean, 
//     default: false 
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   resetPasswordToken: { 
//     type: String 
//   },
//   resetPasswordExpires: { 
//     type: Date 
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// }, {
//   timestamps: true
// });

// // Existing pre-save middleware for userId generation
// userSchema.pre('save', async function(next) {
//   // Only generate userId if it's a new user AND userId is not already set
//   if (this.isNew && !this.userId) {
//     // Extract domain from email
//     const emailParts = this.email.split('@');
//     const domain = emailParts[1].split('.')[0];
    
//     // Generate base for userId using first letter of first name, first letter of last name, and domain
//     const baseId = `${this.firstName.charAt(0)}${this.lastName.charAt(0)}-${domain}`.toUpperCase();
    
//     // Find the count of existing users with similar userId pattern and same company code
//     const UserModel = await getUserModel(this.companyCode);
//     const count = await UserModel.countDocuments({
//       userId: new RegExp(`^${baseId}`),
//       companyCode: this.companyCode
//     });
    
//     // Create userId with sequential number
//     this.userId = `${baseId}-${(count + 1).toString().padStart(4, '0')}`;
//   }
//   next();
// });

// // Hash password before saving
// userSchema.pre('save', async function(next) {
//   // Skip middleware if flag is set
//   if (this.$skipMiddleware) {
//     return next();
//   }
  
//   if (this.isModified('password')) {
//     // Check if password is already hashed to prevent double hashing
//     if (this.password.startsWith('$2a$') || this.password.startsWith('$2b$')) {
//       console.log('Password appears to be already hashed, skipping hashing');
//       return next();
//     }
    
//     console.log('Hashing password for user:', {
//       email: this.email,
//       companyCode: this.companyCode,
//       passwordLength: this.password.length
//     });
    
//     this.password = await bcrypt.hash(this.password, 10);
//     console.log(`Hashed password length: ${this.password.length}`);
//   }
//   next();
// });

// userSchema.methods.comparePassword = async function(candidatePassword) {
//   try {
//     console.log('Comparing password for user:', this.email);
//     // Use bcrypt directly to avoid any issues with method binding
//     const isMatch = await bcrypt.compare(candidatePassword, this.password);
//     console.log('Password match result:', isMatch);
//     return isMatch;
//   } catch (error) {
//     console.error('Error comparing passwords:', error);
//     // Return false instead of throwing to avoid crashing the login process
//     return false;
//   }
// };


// // Method to assign permissions based on role

// userSchema.methods.assignPermissions = function() {
//   switch(this.role) {
//     case 'admin':
//       this.permissions = [
//         'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
//         'view_payroll', 'manage_payroll',
//         'view_leave', 'approve_leave', 'manage_leave_policy',
//         'view_attendance', 'manage_attendance',
//         'view_reports', 'create_reports',
//         'manage_company_settings'
//       ];
//       break;
//     case 'hr':
//       this.permissions = [
//         'view_employees', 'edit_employees', 'create_employees',
//         'view_payroll', 'manage_payroll',
//         'view_leave', 'approve_leave', 'manage_leave_policy',
//         'view_attendance', 'manage_attendance',
//         'view_reports', 'create_reports'
//       ];
//       break;
//     case 'manager':
//       this.permissions = [
//         'view_employees',
//         'view_leave', 'approve_leave',
//         'view_attendance',
//         'view_reports'
//       ];
//       break;
//     case 'employee':
//       this.permissions = [
//         'view_leave'
//       ];
//       break;
//   }
// };

// // This model will be in the main database for global user authentication
// const MainUser = mongoose.model('User', userSchema);

// // // Function to get User model for a specific company
// // const getUserModel = async (companyCode) => {
// //   return await createCompanyModel(companyCode, 'User', userSchema);
// // };

// // Function to get User model for a specific company
// const getUserModel = async (companyCode) => {
//   if (!companyCode) {
//     throw new Error('Company code is required to get user model');
//   }
  
//   try {
//     const model = await createCompanyModel(companyCode, 'User', userSchema);
//     return model;
//   } catch (error) {
//     console.error(`Error getting User model for company ${companyCode}:`, error);
//     throw error;
//   }
// };

// // Add these methods to your User model schema
// userSchema.statics.generatePassword = function() {
//   const length = 10;
//   const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
//   let password = "";
//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * charset.length);
//     password += charset[randomIndex];
//   }
//   return password;
// };

// userSchema.methods.setPassword = function(password) {
//   // This method should set the password (it will be hashed by the pre-save hook)
//   this.password = password;
// };

// userSchema.statics.createFromInvitation = async function(invitation, password) {
//   // Create the full name from first, middle, and last name
//   const fullName = `${invitation.firstName}${invitation.middleName ? ' ' + invitation.middleName : ''} ${invitation.lastName}`;
  
//   const user = new this({
//     firstName: invitation.firstName,
//     middleName: invitation.middleName || '',
//     lastName: invitation.lastName,
//     // Add the name field - this was missing
//     name: fullName,
//     email: invitation.email.toLowerCase(),
//     // Add the password field directly - this was missing
//     password: password, // Will be hashed by pre-save hook
//     role: invitation.role,
//     companyCode: invitation.companyCode,
//     isVerified: true,
//     isActive: true
//   });
  
  
//   await user.save();
//   return user;
// };


// export { userSchema, getUserModel };
// export default MainUser;
