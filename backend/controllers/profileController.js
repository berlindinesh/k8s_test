import Profile from '../models/profileModels.js';
import bcrypt from 'bcryptjs';
import jwt  from 'jsonwebtoken';

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