import MyLeaveRequest, { myLeaveRequestSchema } from '../models/MyLeaveRequest.js';
import LeaveBalance, { leaveBalanceSchema } from '../models/LeaveBalance.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Helper function to calculate number of days between dates (excluding weekends)
const calculateBusinessDays = (startDate, endDate, isHalfDay) => {
  if (isHalfDay) return 0.5;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let count = 0;
  const currentDate = new Date(start);
  
  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Not a weekend
      count++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return count;
};

// Process monthly accruals for earned leave
const processMonthlyAccrual = async (employeeCode, companyCode) => {
  try {
    // Get company-specific LeaveBalance model
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) {
      console.log(`No leave balance found for employee ${employeeCode}, skipping accrual`);
      return;
    }
    
    const now = new Date();
    const lastAccrual = new Date(leaveBalance.lastAccrualDate);
    
    // Calculate months difference
    const monthsDiff = (now.getFullYear() - lastAccrual.getFullYear()) * 12 + 
                       (now.getMonth() - lastAccrual.getMonth());
    
    console.log(`Months since last accrual: ${monthsDiff} for employee ${employeeCode}`);
    
    // If we've passed at least one month since last accrual
    if (monthsDiff >= 1) {
      console.log(`Processing accrual of ${monthsDiff} months for employee ${employeeCode}`);
      
      // Add 1 earned leave per month
      leaveBalance.earned.total += monthsDiff;
      
      // Add 1 casual leave per month up to the maximum of 12
      const casualToAdd = Math.min(monthsDiff, 12 - leaveBalance.casual.total);
      if (casualToAdd > 0) {
        leaveBalance.casual.total += casualToAdd;
      }
      
      // Update last accrual date
      leaveBalance.lastAccrualDate = now;
      
      await leaveBalance.save();
      console.log(`Accrual processed successfully for employee ${employeeCode}`);
    }
  } catch (error) {
    console.error(`Error processing monthly accrual for employee ${employeeCode}:`, error);
  }
};

export const getLeaveBalance = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Getting leave balance for company: ${companyCode}`);
    
    // Get company-specific LeaveBalance model
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const { employeeCode } = req.params;
    
    // Process any pending accruals first
    await processMonthlyAccrual(employeeCode, companyCode);
    
    // Find or create leave balance
    let leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) {
      console.log(`Creating new leave balance for employee ${employeeCode}`);
      // Create with default values
      leaveBalance = new CompanyLeaveBalance({ 
        employeeCode,
        annual: { total: 15, used: 0, pending: 0 },
        sick: { total: 12, used: 0, pending: 0 },
        personal: { total: 5, used: 0, pending: 0 },
        maternity: { total: 90, used: 0, pending: 0 },
        paternity: { total: 15, used: 0, pending: 0 },
        casual: { total: 12, used: 0, pending: 0 },
        earned: { total: 15, used: 0, pending: 0 },
        lastAccrualDate: new Date()
      });
      await leaveBalance.save();
    }
    
    res.status(200).json(leaveBalance);
  } catch (error) {
    console.error("Error in getLeaveBalance:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllLeaveRequests = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Getting all leave requests for company: ${companyCode}`);
    
    // Get company-specific MyLeaveRequest model
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    
    const leaveRequests = await CompanyLeaveRequest.find().sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const createLeaveRequest = async (req, res) => {
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     if (!companyCode) {
//       return res.status(401).json({ 
//         error: 'Authentication required', 
//         message: 'Company code not found in request' 
//       });
//     }
    
//     console.log(`Creating leave request for company: ${companyCode}`);
    
//     // Get company-specific models
//     const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
//     const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
//     const { employeeCode, leaveType, startDate, endDate, halfDay } = req.body;
    
//     // Calculate number of days
//     const numberOfDays = calculateBusinessDays(startDate, endDate, halfDay);
    
//     // Check if employee has sufficient leave balance
//     let leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
    
//     if (!leaveBalance) {
//       // Create new balance if not exists
//       leaveBalance = new CompanyLeaveBalance({ 
//         employeeCode,
//         annual: { total: 15, used: 0, pending: 0 },
//         sick: { total: 12, used: 0, pending: 0 },
//         personal: { total: 5, used: 0, pending: 0 },
//         maternity: { total: 90, used: 0, pending: 0 },
//         paternity: { total: 15, used: 0, pending: 0 },
//         casual: { total: 12, used: 0, pending: 0 },
//         earned: { total: 15, used: 0, pending: 0 },
//         lastAccrualDate: new Date()
//       });
//       await leaveBalance.save();
//     } else {
//       // Process any pending accruals
//       await processMonthlyAccrual(employeeCode, companyCode);
      
//       // Refresh leave balance after accrual
//       leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
//     }
    
//     // Check if employee has enough balance
//     const availableBalance = leaveBalance[leaveType].total - leaveBalance[leaveType].used - leaveBalance[leaveType].pending;
    
//     if (numberOfDays > availableBalance) {
//       return res.status(400).json({ 
//         message: `Insufficient ${leaveType} leave balance. Available: ${availableBalance} days, Requested: ${numberOfDays} days` 
//       });
//     }
    
//     // Create leave request with calculated days
//     const leaveData = {
//       ...req.body,
//       status: 'pending',
//       numberOfDays
//     };
    
//     const newLeaveRequest = new CompanyLeaveRequest(leaveData);
//     const savedLeaveRequest = await newLeaveRequest.save();
    
//     // Update pending balance
//     leaveBalance[leaveType].pending += numberOfDays;
//     await leaveBalance.save();
    
//     res.status(201).json(savedLeaveRequest);
//   } catch (error) {
//     console.error("Error in createLeaveRequest:", error);
//     res.status(400).json({ message: error.message });
//   }
// };

export const createLeaveRequest = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating leave request for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const { employeeCode, leaveType, startDate, endDate, halfDay, userId } = req.body;
    
    // Calculate number of days
    const numberOfDays = calculateBusinessDays(startDate, endDate, halfDay);
    
    // Check if employee has sufficient leave balance
    let leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) {
      // Create new balance if not exists
      leaveBalance = new CompanyLeaveBalance({ 
        employeeCode,
        annual: { total: 15, used: 0, pending: 0 },
        sick: { total: 12, used: 0, pending: 0 },
        personal: { total: 5, used: 0, pending: 0 },
        maternity: { total: 90, used: 0, pending: 0 },
        paternity: { total: 15, used: 0, pending: 0 },
        casual: { total: 12, used: 0, pending: 0 },
        earned: { total: 15, used: 0, pending: 0 },
        lastAccrualDate: new Date()
      });
      await leaveBalance.save();
    } else {
      // Process any pending accruals
      await processMonthlyAccrual(employeeCode, companyCode);
      
      // Refresh leave balance after accrual
      leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
    }
    
    // Check if employee has enough balance
    const availableBalance = leaveBalance[leaveType].total - leaveBalance[leaveType].used - leaveBalance[leaveType].pending;
    
    if (numberOfDays > availableBalance) {
      return res.status(400).json({ 
        message: `Insufficient ${leaveType} leave balance. Available: ${availableBalance} days, Requested: ${numberOfDays} days` 
      });
    }
    
    // Create leave request with calculated days and userId
    const leaveData = {
      ...req.body,
      status: 'pending',
      numberOfDays,
      userId: userId || employeeCode // Use userId if provided, otherwise use employeeCode
    };
    
    const newLeaveRequest = new CompanyLeaveRequest(leaveData);
    const savedLeaveRequest = await newLeaveRequest.save();
    
    // Update pending balance
    leaveBalance[leaveType].pending += numberOfDays;
    await leaveBalance.save();
    
    res.status(201).json(savedLeaveRequest);
  } catch (error) {
    console.error("Error in createLeaveRequest:", error);
    res.status(400).json({ message: error.message });
  }
};


export const updateLeaveComment = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Updating leave comment for company: ${companyCode}`);
    
    // Get company-specific MyLeaveRequest model
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    
    const { id } = req.params;
    const { comment } = req.body;
    
    const updatedLeaveRequest = await CompanyLeaveRequest.findByIdAndUpdate(
      id,
      { comment },
      { new: true }
    );
    
    if (!updatedLeaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteLeaveRequest = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Deleting leave request for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    // Find the leave request first
    const leaveRequest = await CompanyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only allow deletion if the request is still pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ 
        message: 'Cannot delete a leave request that has already been processed' 
      });
    }
    
    // Update leave balance
    const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
    if (leaveBalance) {
      leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
      await leaveBalance.save();
    }
    
    await CompanyLeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// // Update the approveLeaveRequest function
// export const approveLeaveRequest = async (req, res) => {
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     if (!companyCode) {
//       return res.status(401).json({ 
//         error: 'Authentication required', 
//         message: 'Company code not found in request' 
//       });
//     }
    
//     console.log(`Approving leave request for company: ${companyCode}`);
    
//     // Get company-specific models
//     const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
//     const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
//     const leaveRequest = await CompanyLeaveRequest.findById(req.params.id);
    
//     if (!leaveRequest) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }
    
//     // Only approve if it's pending
//     if (leaveRequest.status !== 'pending') {
//       return res.status(400).json({ message: 'This request is not in pending status' });
//     }
    
//     // Update leave balance
//     const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
//     if (leaveBalance) {
//       // Move from pending to used
//       leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
//       leaveBalance[leaveRequest.leaveType].used += leaveRequest.numberOfDays;
//       await leaveBalance.save();
//     }
    
//     // Update leave request status
//     const updatedLeaveRequest = await CompanyLeaveRequest.findByIdAndUpdate(
//       req.params.id,
//       { status: 'approved' },
//       { new: true }
//     );
    
//     res.status(200).json(updatedLeaveRequest);
//   } catch (error) {
//     console.error("Error in approveLeaveRequest:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update the rejectLeaveRequest function
// export const rejectLeaveRequest = async (req, res) => {
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     if (!companyCode) {
//       return res.status(401).json({ 
//         error: 'Authentication required', 
//         message: 'Company code not found in request' 
//       });
//     }
    
//     console.log(`Rejecting leave request for company: ${companyCode}`);
    
//         // Get company-specific models
//     const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
//     const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
//     const { rejectionReason } = req.body;
    
//     if (!rejectionReason) {
//       return res.status(400).json({ message: 'Rejection reason is required' });
//     }
    
//     const leaveRequest = await CompanyLeaveRequest.findById(req.params.id);
    
//     if (!leaveRequest) {
//       return res.status(404).json({ message: 'Leave request not found' });
//     }
    
//     // Only reject if it's pending
//     if (leaveRequest.status !== 'pending') {
//       return res.status(400).json({ message: 'This request is not in pending status' });
//     }
    
//     // Update leave balance
//     const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
//     if (leaveBalance) {
//       // Remove from pending
//       leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
//       await leaveBalance.save();
//     }
    
//     const updatedLeaveRequest = await CompanyLeaveRequest.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status: 'rejected',
//         rejectionReason 
//       },
//       { new: true }
//     );
    
//     res.status(200).json(updatedLeaveRequest);
//   } catch (error) {
//     console.error("Error in rejectLeaveRequest:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// Update the approveLeaveRequest function
export const approveLeaveRequest = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Approving leave request for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const leaveRequest = await CompanyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only approve if it's pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ message: 'This request is not in pending status' });
    }
    
    // Update leave balance
    const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
    if (leaveBalance) {
      // Move from pending to used
      leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
      leaveBalance[leaveRequest.leaveType].used += leaveRequest.numberOfDays;
      await leaveBalance.save();
    }
    
    // Update leave request status
    const updatedLeaveRequest = await CompanyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    
    // Send notification if there's a notification service
    if (req.app.get('io') && leaveRequest.employeeCode) {
      try {
        // Create notification in database
        const NotificationModel = mongoose.model('Notification');
        const newNotification = new NotificationModel({
          userId: leaveRequest.employeeCode, // Use employeeCode as userId
          message: `Your leave request has been approved`,
          type: 'leave',
          status: 'approved',
          read: false
        });
        
        const savedNotification = await newNotification.save();
        
        // Emit socket event
        const io = req.app.get('io');
        io.to(leaveRequest.employeeCode).emit('new-notification', savedNotification);
        
        console.log(`Sent leave approval notification to user ${leaveRequest.employeeCode}`);
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
        // Continue with the response even if notification fails
      }
    }
    
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    console.error("Error in approveLeaveRequest:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update the rejectLeaveRequest function
export const rejectLeaveRequest = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Rejecting leave request for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    
    const leaveRequest = await CompanyLeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only reject if it's pending
    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ message: 'This request is not in pending status' });
    }
    
    // Update leave balance
    const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
    
    if (leaveBalance) {
      // Remove from pending
      leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
      await leaveBalance.save();
    }
    
    const updatedLeaveRequest = await CompanyLeaveRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason 
      },
      { new: true }
    );
    
    // Send notification if there's a notification service
    if (req.app.get('io') && leaveRequest.employeeCode) {
      try {
        // Create notification in database
        const NotificationModel = mongoose.model('Notification');
        const newNotification = new NotificationModel({
          userId: leaveRequest.employeeCode, // Use employeeCode as userId
          message: `Your leave request has been rejected`,
          type: 'leave',
          status: 'rejected',
          read: false
        });
        
        const savedNotification = await newNotification.save();
        
        // Emit socket event
        const io = req.app.get('io');
        io.to(leaveRequest.employeeCode).emit('new-notification', savedNotification);
        
        console.log(`Sent leave rejection notification to user ${leaveRequest.employeeCode}`);
      } catch (notificationError) {
        console.error("Failed to send notification:", notificationError);
        // Continue with the response even if notification fails
      }
    }
    
    res.status(200).json(updatedLeaveRequest);
  } catch (error) {
    console.error("Error in rejectLeaveRequest:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Getting employee leave requests for company: ${companyCode}`);
    
    // Get company-specific MyLeaveRequest model
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    
    const { employeeCode } = req.params;
    const leaveRequests = await CompanyLeaveRequest.find({ employeeCode }).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get leave statistics for dashboard
export const getLeaveStatistics = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Getting leave statistics for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const { employeeCode } = req.params;
    
    // Process any pending accruals first
    await processMonthlyAccrual(employeeCode, companyCode);
    
    // Get leave balance
    let leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) {
      leaveBalance = new CompanyLeaveBalance({ 
        employeeCode,
        annual: { total: 15, used: 0, pending: 0 },
        sick: { total: 12, used: 0, pending: 0 },
        personal: { total: 5, used: 0, pending: 0 },
        maternity: { total: 90, used: 0, pending: 0 },
        paternity: { total: 15, used: 0, pending: 0 },
        casual: { total: 12, used: 0, pending: 0 },
        earned: { total: 15, used: 0, pending: 0 },
        lastAccrualDate: new Date()
      });
      await leaveBalance.save();
    }
    
    // Get all leave requests for this employee
    const leaveRequests = await CompanyLeaveRequest.find({ employeeCode }).sort({ createdAt: -1 });
    
    // Calculate monthly usage
    const monthlyUsage = {};
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Initialize all months
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach(month => {
      monthlyUsage[month] = 0;
    });
    
    // Calculate leave type usage
    const leaveTypeUsage = {};
    
    // Initialize all leave types with 0
    ['annual', 'sick', 'personal', 'maternity', 'paternity', 'casual', 'earned'].forEach(type => {
      leaveTypeUsage[type] = 0;
    });
    
    // Get approved leaves only
    const approvedLeaves = leaveRequests.filter(leave => leave.status === 'approved');
    
    approvedLeaves.forEach(leave => {
      // Only count leaves from current year
      const leaveYear = new Date(leave.startDate).getFullYear();
      if (leaveYear === currentYear) {
        const month = months[new Date(leave.startDate).getMonth()];
        monthlyUsage[month] += leave.numberOfDays;
      }
      
      // Count by leave type
      leaveTypeUsage[leave.leaveType] += leave.numberOfDays;
    });
    
    // Get upcoming leaves (pending and approved, with future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingLeaves = leaveRequests.filter(leave => {
      const startDate = new Date(leave.startDate);
      return (leave.status === 'approved' || leave.status === 'pending') && startDate >= today;
    }).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)).slice(0, 5);
    
    res.status(200).json({
      statistics: {
        monthlyUsage,
        leaveTypeUsage
      },
      upcomingLeaves
    });
  } catch (error) {
    console.error("Error in getLeaveStatistics:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reset annual leaves at the beginning of the year
export const resetAnnualLeaves = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Resetting annual leaves for company: ${companyCode}`);
    
    // Get company-specific LeaveBalance model
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    // This would typically be run by a cron job on Jan 1
    // But we'll provide an API endpoint for manual triggering
    
    const { year } = req.body;
    
    if (!year) {
      return res.status(400).json({ message: 'Year parameter is required' });
    }
    
    // Reset annual leave for all employees
    await CompanyLeaveBalance.updateMany(
      {},
      { 
        $set: {
          'annual.total': 15,
          'annual.used': 0,
          'annual.pending': 0,
          'sick.total': 12,
          'sick.used': 0,
          'casual.total': 12,
          'casual.used': 0
        }
      }
    );
    
    res.status(200).json({ message: `Annual leaves reset for ${year}` });
  } catch (error) {
    console.error("Error in resetAnnualLeaves:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update earned leave balance for all employees
export const updateEarnedLeaveBalance = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Updating earned leave balance for company: ${companyCode}`);
    
    // Get company-specific LeaveBalance model
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    await CompanyLeaveBalance.updateMany(
      {}, 
      { $set: { "earned.total": 15 } }
    );
    
    res.status(200).json({ message: "Earned leave balance updated for all employees" });
  } catch (error) {
    console.error("Error updating earned leave balance:", error);
    res.status(500).json({ message: "Error updating earned leave balance" });
  }
};

// Recalculate leave balance for a specific employee
export const recalculateLeaveBalance = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Recalculating leave balance for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const { employeeCode } = req.params;
    
    // Get all leave requests for this employee
    const leaveRequests = await CompanyLeaveRequest.find({ employeeCode });
    
    // Get the leave balance document
    let leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode });
    
    if (!leaveBalance) {
      return res.status(404).json({ message: "Leave balance not found" });
    }
    
    // Reset used and pending counts for all leave types
    const leaveTypes = ['annual', 'sick', 'personal', 'maternity', 'paternity', 'casual', 'earned'];
    leaveTypes.forEach(type => {
      leaveBalance[type].used = 0;
      leaveBalance[type].pending = 0;
    });
    
    // Recalculate based on actual leave requests
    leaveRequests.forEach(request => {
      const { leaveType, numberOfDays, status } = request;
      
      if (status === 'approved') {
        leaveBalance[leaveType].used += numberOfDays;
      } else if (status === 'pending') {
        leaveBalance[leaveType].pending += numberOfDays;
      }
    });
    
    // Save the updated balance
    await leaveBalance.save();
    
    res.status(200).json(leaveBalance);
  } catch (error) {
    console.error("Error recalculating leave balance:", error);
    res.status(500).json({ message: "Error recalculating leave balance" });
  }
};

// Bulk approve leave requests
export const bulkApproveLeaveRequests = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Bulk approving leave requests for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const { requestIds } = req.body;
    
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({ message: 'Request IDs array is required' });
    }
    
    const results = {
      successful: [],
      failed: []
    };
    
    // Process each request
    for (const id of requestIds) {
      try {
        const leaveRequest = await CompanyLeaveRequest.findById(id);
        
        if (!leaveRequest) {
          results.failed.push({ id, reason: 'Leave request not found' });
          continue;
        }
        
        // Only approve if it's pending
        if (leaveRequest.status !== 'pending') {
          results.failed.push({ id, reason: 'Request is not in pending status' });
          continue;
        }
        
        // Update leave balance
        const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
        
        if (leaveBalance) {
          // Move from pending to used
          leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
          leaveBalance[leaveRequest.leaveType].used += leaveRequest.numberOfDays;
          await leaveBalance.save();
        }
        
        // Update leave request status
        const updatedLeaveRequest = await CompanyLeaveRequest.findByIdAndUpdate(
          id,
          { status: 'approved' },
          { new: true }
        );
        
        results.successful.push(updatedLeaveRequest);
      } catch (error) {
        console.error(`Error approving leave request ${id}:`, error);
        results.failed.push({ id, reason: error.message });
      }
    }
    
    res.status(200).json({
      message: `Processed ${requestIds.length} requests. ${results.successful.length} approved, ${results.failed.length} failed.`,
      results
    });
  } catch (error) {
    console.error("Error in bulkApproveLeaveRequests:", error);
    res.status(500).json({ message: error.message });
  }
};

// Bulk reject leave requests
export const bulkRejectLeaveRequests = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Bulk rejecting leave requests for company: ${companyCode}`);
    
    // Get company-specific models
    const CompanyLeaveRequest = await getModelForCompany(companyCode, 'MyLeaveRequest', myLeaveRequestSchema);
    const CompanyLeaveBalance = await getModelForCompany(companyCode, 'LeaveBalance', leaveBalanceSchema);
    
    const { requestIds, rejectionReason } = req.body;
    
    if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
      return res.status(400).json({ message: 'Request IDs array is required' });
    }
    
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    
    const results = {
      successful: [],
      failed: []
    };
    
    // Process each request
    for (const id of requestIds) {
      try {
        const leaveRequest = await CompanyLeaveRequest.findById(id);
        
        if (!leaveRequest) {
          results.failed.push({ id, reason: 'Leave request not found' });
          continue;
        }
        
        // Only reject if it's pending
        if (leaveRequest.status !== 'pending') {
          results.failed.push({ id, reason: 'Request is not in pending status' });
          continue;
        }
        
        // Update leave balance
        const leaveBalance = await CompanyLeaveBalance.findOne({ employeeCode: leaveRequest.employeeCode });
        
        if (leaveBalance) {
          // Remove from pending
          leaveBalance[leaveRequest.leaveType].pending -= leaveRequest.numberOfDays;
          await leaveBalance.save();
        }
        
        // Update leave request status
        const updatedLeaveRequest = await CompanyLeaveRequest.findByIdAndUpdate(
          id,
          { 
            status: 'rejected',
            rejectionReason 
          },
          { new: true }
        );
        
        results.successful.push(updatedLeaveRequest);
      } catch (error) {
        console.error(`Error rejecting leave request ${id}:`, error);
        results.failed.push({ id, reason: error.message });
      }
    }
    
    res.status(200).json({
      message: `Processed ${requestIds.length} requests. ${results.successful.length} rejected, ${results.failed.length} failed.`,
      results
    });
  } catch (error) {
    console.error("Error in bulkRejectLeaveRequests:", error);
    res.status(500).json({ message: error.message });
  }
};

