import { getUserModel } from '../models/User.js';
import Invitation from '../models/Invitation.js';
import bcrypt from 'bcryptjs';

// Get all users for a company
export const getUsers = async (req, res) => {
  try {
    const CompanyUser = await getUserModel(req.companyCode);
    
    // Get all active users (excluding those who haven't completed first login)
    const users = await CompanyUser.find({
      $or: [
        { isFirstLogin: false }, // Users who have completed first login
        { isActive: true, isFirstLogin: true } // Active invited users
      ]
    }).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const CompanyUser = await getUserModel(req.companyCode);
    
    const user = await CompanyUser.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (!role || !['admin', 'hr', 'manager', 'employee'].includes(role)) {
      return res.status(400).json({ message: 'Valid role is required' });
    }
    
    const CompanyUser = await getUserModel(req.companyCode);
    const user = await CompanyUser.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user role and permissions
    user.role = role;
    user.assignPermissions(); // This method assigns permissions based on role
    user.lastModified = new Date();
    user.$skipMiddleware = true; // Skip password hashing
    
    await user.save();
    
    console.log(`User role updated: ${user.email} -> ${role}`);
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive must be a boolean value' });
    }
    
    const CompanyUser = await getUserModel(req.companyCode);
    const user = await CompanyUser.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deactivating the last admin
    if (!isActive && user.role === 'admin') {
      const adminCount = await CompanyUser.countDocuments({ 
        role: 'admin', 
        isActive: true,
        _id: { $ne: userId }
      });
      
      if (adminCount === 0) {
        return res.status(400).json({ 
          message: 'Cannot deactivate the last admin user' 
        });
      }
    }
    
    user.isActive = isActive;
    user.lastModified = new Date();
    user.$skipMiddleware = true; // Skip password hashing
    
    await user.save();
    
    console.log(`User status updated: ${user.email} -> ${isActive ? 'Active' : 'Inactive'}`);
    
    res.status(200).json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, middleName, lastName, email } = req.body;
    
    if (!firstName || !lastName || !email) {
      return res.status(400).json({ 
        message: 'First name, last name, and email are required' 
      });
    }
    
    const CompanyUser = await getUserModel(req.companyCode);
    const user = await CompanyUser.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is already taken by another user
    if (email.toLowerCase() !== user.email) {
      const existingUser = await CompanyUser.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: userId }
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: 'Email is already taken by another user' 
        });
      }
    }
    
    // Update user profile
    user.firstName = firstName;
    user.middleName = middleName || '';
    user.lastName = lastName;
    user.name = `${firstName}${middleName ? ' ' + middleName : ''} ${lastName}`;
    user.email = email.toLowerCase();
    user.lastModified = new Date();
    user.$skipMiddleware = true; // Skip password hashing
    
    await user.save();
    
    console.log(`User profile updated: ${user.email}`);
    
    res.status(200).json({
      message: 'User profile updated successfully',
      user: {
        id: user._id,
        userId: user.userId,
        name: user.name,
        email: user.email,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const CompanyUser = await getUserModel(req.companyCode);
    
    const user = await CompanyUser.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await CompanyUser.countDocuments({ 
        role: 'admin',
        _id: { $ne: userId }
      });
      
      if (adminCount === 0) {
        return res.status(400).json({ 
          message: 'Cannot delete the last admin user' 
        });
      }
    }
    
    // If user has an associated invitation, update its status
    if (user.invitationId) {
      await Invitation.findByIdAndUpdate(user.invitationId, {
        status: 'cancelled',
        lastModified: new Date()
      });
    }
    
    // Delete the user
    await CompanyUser.findByIdAndDelete(userId);
    
    console.log(`User deleted: ${user.email}`);
    
    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

// Reset user password
export const resetUserPassword = async (req, res) => {
  try {
    const { userId } = req.params;
    const CompanyUser = await getUserModel(req.companyCode);
    
    const user = await CompanyUser.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate new temporary password
    const tempPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).toUpperCase().slice(-2) + '!1';
    
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(tempPassword, saltRounds);
    
    user.password = hashedPassword;
    user.isFirstLogin = true; // Force password change on next login
    user.lastModified = new Date();
    user.$skipMiddleware = true; // Skip password hashing middleware
    
    await user.save();
    
    console.log(`Password reset for user: ${user.email}`);
    
    // In a real application, you would send this password via email
    // For now, we'll return it in the response (remove in production)
    res.status(200).json({
      message: 'Password reset successfully',
      temporaryPassword: tempPassword, // Remove this in production
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: error.message });
  }
};

export default {
  getUsers,
  getUser,
  updateUserRole,
  updateUserStatus,
  updateUserProfile,
  deleteUser,
  resetUserPassword
};
