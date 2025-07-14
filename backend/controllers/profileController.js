// const User = require('../models/User');

import Profile from '../models/profileModels.js';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';

// Register User
// exports.registerUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ msg: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ ...req.body, password: hashedPassword });
//     await user.save();

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token, user });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Get User Profile
const getUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ msg: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User Profile
const updateUserProfile = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProfiles=async(req, res)=>{
  try{
    const profiles = await Profile.find();
    res.json(profiles)
  }catch(error){
    res.status(500).json({error: error.message})
  }
}

export {getUserProfile, updateUserProfile, getAllProfiles}