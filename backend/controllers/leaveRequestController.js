import LeaveRequest from '../models/LeaveRequest.js';

// Get all leave requests (for HR/admin)
export const getLeaveRequests = async (req, res) => {
  try {
    const { type, status, startDate, endDate, searchTerm } = req.query;
    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (startDate && endDate) {
      filter.startDate = { $gte: new Date(startDate) };
      filter.endDate = { $lte: new Date(endDate) };
    }
    if (searchTerm) {
      filter.$or = [
        { employeeName: { $regex: searchTerm, $options: 'i' } },
        { employeeCode: { $regex: searchTerm, $options: 'i' } },
        { type: { $regex: searchTerm, $options: 'i' } },
        { status: { $regex: searchTerm, $options: 'i' } },
        { reason: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const leaveRequests = await LeaveRequest.find(filter).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new leave request
export const createLeaveRequest = async (req, res) => {
  try {
    // Always set initial status to "Pending"
    const leaveData = {
      ...req.body,
      status: 'Pending'
    };
    
    const newLeaveRequest = new LeaveRequest(leaveData);
    const savedRequest = await newLeaveRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a leave request
export const updateLeaveRequest = async (req, res) => {
  try {
    // Find the leave request first
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // If an employee is updating their own request, only allow if it's still pending
    if (req.query.employee === 'true' && leaveRequest.status !== 'Pending') {
      return res.status(400).json({ 
        message: 'Cannot update a leave request that has already been processed' 
      });
    }
    
    // If it's an employee update, ensure status remains pending
    const updatedData = req.query.employee === 'true' 
      ? { ...req.body, status: 'Pending' }
      : req.body;
    
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a leave request
export const deleteLeaveRequest = async (req, res) => {
  try {
    // Find the leave request first
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // If an employee is deleting their own request, only allow if it's still pending
    if (req.query.employee === 'true' && leaveRequest.status !== 'Pending') {
      return res.status(400).json({ 
        message: 'Cannot delete a leave request that has already been processed' 
      });
    }
    
    const deletedRequest = await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update leave request status (approve/reject)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    
    // Validate status
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    
    // If rejecting, require a comment
    if (status === 'Rejected' && (!comment || comment.trim() === '')) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, comment },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update leave request comment
export const updateLeaveComment = async (req, res) => {
  try {
    const { comment } = req.body;
    
    const updatedRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { comment },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get leave requests for a specific employee
export const getEmployeeLeaveRequests = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const leaveRequests = await LeaveRequest.find({ employeeId }).sort({ createdAt: -1 });
    res.status(200).json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve leave request
export const approveLeaveRequest = async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    res.status(200).json(leaveRequest);
  } catch (error) {
    console.error("Error in approveLeaveRequest:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reject leave request
export const rejectLeaveRequest = async (req, res) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }
    
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'rejected',
        rejectionReason 
      },
      { new: true }
    );
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    res.status(200).json(leaveRequest);
  } catch (error) {
    console.error("Error in rejectLeaveRequest:", error);
    res.status(500).json({ message: error.message });
  }
};