import User from '../models/User.js';

// Get all users with their roles (for admin)
export const getUsersWithRoles = async (req, res) => {
  try {
    const users = await User.find({ companyCode: req.companyCode })
      .select('userId name email role permissions isActive');
    
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    const user = await User.findOne({ 
      _id: userId, 
      companyCode: req.companyCode 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    
    // Update permissions based on new role
    user.assignPermissions();
    
    await user.save();
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user custom permissions
export const updateUserPermissions = async (req, res) => {
  try {
    const { userId } = req.params;
    const { permissions } = req.body;
    
    const user = await User.findOne({ 
      _id: userId, 
      companyCode: req.companyCode 
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Validate permissions
    const validPermissions = [
      'view_employees', 'edit_employees', 'create_employees', 'delete_employees',
      'view_payroll', 'manage_payroll',
      'view_leave', 'approve_leave', 'manage_leave_policy',
      'view_attendance', 'manage_attendance',
      'view_reports', 'create_reports',
      'manage_company_settings'
    ];
    
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      return res.status(400).json({ 
        message: 'Invalid permissions detected', 
        invalidPermissions 
      });
    }
    
    user.permissions = permissions;
    await user.save();
    
    res.status(200).json({
      message: 'User permissions updated successfully',
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
