import express from 'express';
import { getUserProfile, updateUserProfile, getAllProfiles } from '../controllers/profileController.js';

const router = express.Router();
router.get('/profile/:Id', getUserProfile);
router.get('/all', getAllProfiles)
router.put('/profile/:Id', updateUserProfile);

export default router
