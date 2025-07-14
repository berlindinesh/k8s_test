

import express from 'express';
import { registerAuth, verifyOtp, loginAuth, forgotPassword, resetPassword,getUserId } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerAuth);
router.post('/verify-otp', verifyOtp);
router.post('/login', loginAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


router.post('/get-user-id', getUserId);

router.get('/user/:userId', async (req, res) => {
    try {
      const user = await User.findOne({ userId: req.params.userId });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      
      res.json({
        success: true,
        user: {
          firstName: user.firstName,
          middleName: user.middleName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  


export default router;

