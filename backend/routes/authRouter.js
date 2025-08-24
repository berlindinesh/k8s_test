import express from 'express';
import { registerAuth, verifyOtp, loginAuth, forgotPassword, resetPassword,getUserId } from '../controllers/authController.js';
import { getUserModel } from '../models/User.js';
import { authenticate } from '../middleware/companyAuth.js';

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
          email: user.email,
          role: user.role,
          permissions: user.permissions
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });

// Add route to fetch user role by userId (for authenticated users)
router.get('/user-role-by-id/:userId', authenticate, async (req, res) => {
  try {
    const companyCode = req.companyCode;
    const { userId } = req.params;
    
    if (!companyCode) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }
    
    // Get company-specific User model
    const UserModel = await getUserModel(companyCode);
    
    const user = await UserModel.findOne({ userId: userId })
      .select('userId email role permissions firstName lastName');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error('Error fetching user role by userId:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Debug endpoint to check user-employee data linking
router.get('/debug-user-employee/:empId', authenticate, async (req, res) => {
  try {
    const companyCode = req.companyCode;
    const { empId } = req.params;
    
    if (!companyCode) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }
    
    // Get company-specific models
    const UserModel = await getUserModel(companyCode);
    const getModelForCompany = (await import('../models/genericModelFactory.js')).default;
    const Employee = (await import('../models/employeeRegisterModel.js')).default;
    const CompanyEmployee = await getModelForCompany(companyCode, 'Employee', Employee.schema);
    
    // Find employee
    const employee = await CompanyEmployee.findOne({ Emp_ID: empId });
    
    if (!employee) {
      return res.status(404).json({ 
        success: false, 
        message: 'Employee not found',
        empId: empId
      });
    }
    
    // Find all users to see what emails exist
    const allUsers = await UserModel.find({}).select('userId email role firstName lastName');
    
    // Try to find user by different methods
    const userByUserId = employee.userId ? await UserModel.findOne({ userId: employee.userId }) : null;
    const userByEmail = employee.personalInfo?.email ? await UserModel.findOne({ email: employee.personalInfo.email.toLowerCase() }) : null;
    const userByWorkEmail = employee.personalInfo?.workemail ? await UserModel.findOne({ email: employee.personalInfo.workemail.toLowerCase() }) : null;
    
    res.json({
      success: true,
      debug: {
        employee: {
          empId: employee.Emp_ID,
          userId: employee.userId,
          email: employee.personalInfo?.email,
          workEmail: employee.personalInfo?.workemail,
          firstName: employee.personalInfo?.firstName,
          lastName: employee.personalInfo?.lastName
        },
        usersBySearch: {
          byUserId: userByUserId ? { userId: userByUserId.userId, email: userByUserId.email, role: userByUserId.role } : null,
          byEmail: userByEmail ? { userId: userByEmail.userId, email: userByEmail.email, role: userByEmail.role } : null,
          byWorkEmail: userByWorkEmail ? { userId: userByWorkEmail.userId, email: userByWorkEmail.email, role: userByWorkEmail.role } : null
        },
        allUsers: allUsers.map(u => ({ userId: u.userId, email: u.email, role: u.role, name: `${u.firstName} ${u.lastName}` }))
      }
    });
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message
    });
  }
});

// Add route to fetch user role by email (for authenticated users)
router.get('/user-role/:email', authenticate, async (req, res) => {
  try {
    const companyCode = req.companyCode;
    const { email } = req.params;
    
    if (!companyCode) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }
    
    // Get company-specific User model
    const UserModel = await getUserModel(companyCode);
    
    const user = await UserModel.findOne({ email: email.toLowerCase() })
      .select('userId email role permissions firstName lastName');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: {
        userId: user.userId,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        name: `${user.firstName} ${user.lastName}`
      }
    });
  } catch (error) {
    console.error('Error fetching user role:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
  


export default router;

