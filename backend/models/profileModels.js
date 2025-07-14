import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: String,
  personalInfo: {
    dateOfBirth: Date,
    gender: String,
    address: String,
    country: String,
    state: String,
    city: String,
    qualification: String,
    experience: Number,
    maritalStatus: String
  },
  bankInfo: {
    bankName: String,
    accountNumber: String,
    branch: String,
    bankCode1: String,
    bankAddress: String,
    bankCode2: String
  },
  workInfo: {
    department: String,
    shiftInfo: String,
    jobPosition: String,
    workType: String,
    salary: Number,
    joiningDate: Date,
    endDate: Date,
    workLocation: String
  }
}, { timestamps: true });

profileSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile