// import Feedback from '../models/Feedback.js';
// import Employee from '../models/employeeRegisterModel.js';



// export const createFeedback = async (req, res) => {
//   try {
//     const feedbackData = req.body;
    
//     // If it's self-feedback that needs review, handle the special workflow
//     if (feedbackData.feedbackType === 'selfFeedback' && feedbackData.needsReview) {
//       // Create the self-feedback
//       const selfFeedback = new Feedback({
//         ...feedbackData,
//         feedbackType: 'selfFeedback',
//         status: 'In Progress'
//       });
      
//       // Add initial history entry
//       selfFeedback.history = [{
//         date: new Date(),
//         action: 'Created',
//         user: feedbackData.createdBy || 'System',
//         details: 'Self feedback created and sent for review'
//       }];
      
//       await selfFeedback.save();
      
//       // Create a copy in the feedbackToReview category
//       const reviewFeedback = new Feedback({
//         ...feedbackData,
//         feedbackType: 'feedbackToReview',
//         originalFeedbackId: selfFeedback._id,
//         status: 'Pending',
//         history: [{
//           date: new Date(),
//           action: 'Created',
//           user: feedbackData.createdBy || 'System',
//           details: 'Feedback submitted for review'
//         }]
//       });
      
//       await reviewFeedback.save();
      
//       return res.status(201).json({ 
//         success: true, 
//         message: 'Feedback created and sent for review',
//         data: {
//           selfFeedback,
//           reviewFeedback
//         }
//       });
//     }
    
//     // Regular feedback creation (existing code)
//     const feedback = new Feedback(feedbackData);
    
//     // Add initial history entry
//     feedback.history = [{
//       date: new Date(),
//       action: 'Created',
//       user: feedbackData.createdBy || 'System',
//       details: 'Feedback created'
//     }];
    
//     const savedFeedback = await feedback.save();
//     res.status(201).json(savedFeedback);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const getAllFeedbacks = async (req, res) => {
//   try {
//     // Extract query parameters
//     const { 
//       searchTerm, 
//       status, 
//       employee, 
//       manager, 
//       startDate, 
//       endDate, 
//       priority, 
//       period,
//       sortBy = 'createdAt',
//       sortDirection = 'desc',
//       page = 1,
//       limit = 10
//     } = req.query;
    
//     // Build query
//     let query = {};
    
//     if (searchTerm) {
//       query.$or = [
//         { title: { $regex: searchTerm, $options: 'i' } },
//         { 'employee.name': { $regex: searchTerm, $options: 'i' } },
//         { employee: { $regex: searchTerm, $options: 'i' } },
//         { 'manager.name': { $regex: searchTerm, $options: 'i' } },
//         { manager: { $regex: searchTerm, $options: 'i' } }
//       ];
//     }
    
//     if (status) query.status = status;
//     if (employee) {
//       query.$or = query.$or || [];
//       query.$or.push(
//         { 'employee.name': { $regex: employee, $options: 'i' } },
//         { employee: { $regex: employee, $options: 'i' } }
//       );
//     }
//     if (manager) {
//       query.$or = query.$or || [];
//       query.$or.push(
//         { 'manager.name': { $regex: manager, $options: 'i' } },
//         { manager: { $regex: manager, $options: 'i' } }
//       );
//     }
//     if (startDate) query.startDate = { $gte: new Date(startDate) };
//     if (endDate) query.dueDate = { $lte: new Date(endDate) };
//     if (priority) query.priority = priority;
//     if (period) query.period = period;
    
//     // Count total documents for pagination
//     const total = await Feedback.countDocuments(query);
    
//     // Execute query with pagination and sorting
//     const feedbacks = await Feedback.find(query)
//       .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
    
//     // Organize by feedback type
//     const organizedFeedbacks = {
//       selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback'),
//       requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback'),
//       feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview'),
//       anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback')
//     };
    
//     // Set pagination headers
//     res.set('X-Total-Count', total);
//     res.set('X-Page', page);
//     res.set('X-Limit', limit);
//     res.set('X-Total-Pages', Math.ceil(total / limit));
    
//     res.status(200).json(organizedFeedbacks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// export const updateFeedback = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updateData = req.body;
    
//     // Get the current feedback to track changes
//     const currentFeedback = await Feedback.findById(id);
//     if (!currentFeedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     // Track history if status changed
//     if (updateData.status && updateData.status !== currentFeedback.status) {
//       const historyEntry = {
//         date: new Date(),
//         action: 'Updated',
//         user: updateData.updatedBy || 'System', // In a real app, this would come from auth
//         details: `Status changed from ${currentFeedback.status} to ${updateData.status}`
//       };
      
//       updateData.history = [...currentFeedback.history, historyEntry];
//     }
    
//     const updatedFeedback = await Feedback.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );
    
//     // If this feedback has a linked feedback (original or review), update that too
//     if (currentFeedback.originalFeedbackId) {
//       // This is a review feedback, update the original
//       await Feedback.findByIdAndUpdate(
//         currentFeedback.originalFeedbackId,
//         { status: updateData.status },
//         { new: false }
//       );
//     } else {
//       // Check if this is an original feedback with reviews
//       const linkedReviews = await Feedback.find({ originalFeedbackId: id });
      
//       if (linkedReviews.length > 0) {
//         // Update all linked reviews
//         await Promise.all(
//           linkedReviews.map(review => 
//             Feedback.findByIdAndUpdate(
//               review._id,
//               { status: updateData.status },
//               { new: false }
//             )
//           )
//         );
//       }
//     }
    
//     res.status(200).json(updatedFeedback);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };



// export const deleteFeedback = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const feedback = await Feedback.findById(id);
    
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     // If this is an original feedback with reviews, delete those too
//     if (!feedback.originalFeedbackId) {
//       await Feedback.deleteMany({ originalFeedbackId: id });
//     }
//     // If this is a review feedback, update the original
//     else {
//       const originalFeedback = await Feedback.findById(feedback.originalFeedbackId);
//       if (originalFeedback) {
//         // Add a history entry about the review being deleted
//         originalFeedback.history.push({
//           date: new Date(),
//           action: 'Updated',
//           user: req.body.deletedBy || 'System',
//           details: 'Review feedback was deleted'
//         });
//         await originalFeedback.save();
//       }
//     }
    
//     await Feedback.findByIdAndDelete(id);
//     res.status(200).json({ message: 'Feedback deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const getFeedbacksByType = async (req, res) => {
//   try {
//     const { type } = req.params;
//     const {
//       page = 1,
//       limit = 10,
//       sortBy = 'createdAt',
//       sortDirection = 'desc'
//     } = req.query;
    
//     // Count total documents for pagination
//     const total = await Feedback.countDocuments({ feedbackType: type });
    
//     // Execute query with pagination and sorting
//     const feedbacks = await Feedback.find({ feedbackType: type })
//       .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
//       .skip((page - 1) * limit)
//       .limit(parseInt(limit));
    
//     // Set pagination headers
//     res.set('X-Total-Count', total);
//     res.set('X-Page', page);
//     res.set('X-Limit', limit);
//     res.set('X-Total-Pages', Math.ceil(total / limit));
    
//     res.status(200).json(feedbacks);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbackHistory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const feedback = await Feedback.findById(id);
    
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     res.status(200).json({ history: feedback.history || [] });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const addFeedbackComment = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { comment, user } = req.body;
    
//     if (!comment) {
//       return res.status(400).json({ message: 'Comment is required' });
//     }
    
//     const feedback = await Feedback.findById(id);
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     const historyEntry = {
//       date: new Date(),
//       action: 'Comment',
//       user: user || 'Anonymous',
//       details: comment
//     };
    
//     feedback.history.push(historyEntry);
//     await feedback.save();
    
//     res.status(201).json({ 
//       message: 'Comment added successfully',
//       comment: historyEntry
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbackAnalytics = async (req, res) => {
//   try {
//     // Get all feedbacks
//     const feedbacks = await Feedback.find();
    
//     // Calculate analytics
//     const analytics = {
//       total: feedbacks.length,
//       byStatus: {
//         completed: feedbacks.filter(f => f.status === 'Completed').length,
//         inProgress: feedbacks.filter(f => f.status === 'In Progress').length,
//         notStarted: feedbacks.filter(f => f.status === 'Not Started').length,
//         pending: feedbacks.filter(f => f.status === 'Pending').length,
//       },
//       byType: {
//         selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback').length,
//         requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback').length,
//         feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview').length,
//         anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback').length,
//       },
//       overdue: feedbacks.filter(f => 
//         new Date(f.dueDate) < new Date() && f.status !== 'Completed'
//       ).length,
//       completionRate: feedbacks.length > 0 
//         ? ((feedbacks.filter(f => f.status === 'Completed').length / feedbacks.length) * 100).toFixed(1)
//         : 0
//     };
    
//     res.status(200).json(analytics);
//   } catch (error) {
//     console.error('Error generating analytics:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const submitFeedbackResponse = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { text, rating, submittedBy } = req.body;
    
//     if (!text && !rating) {
//       return res.status(400).json({ message: 'Response text or rating is required' });
//     }
    
//     const feedback = await Feedback.findById(id);
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     // Create response object
//     const response = {
//       text,
//       rating,
//       submittedBy: submittedBy || 'Anonymous',
//       submittedAt: new Date()
//     };
    
//     // Update feedback with response
//     feedback.response = response;
    
//     // Update status to completed
//     feedback.status = 'Completed';
    
//     // Add to history
//     feedback.history.push({
//       date: new Date(),
//       action: 'Response Submitted',
//       user: submittedBy || 'Anonymous',
//       details: `Feedback response submitted with rating: ${rating || 'N/A'}`
//     });
    
//     await feedback.save();
    
//     res.status(200).json({ 
//       message: 'Feedback response submitted successfully',
//       feedback
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbacksByEmployee = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
    
//     // Find feedbacks where this employee is either the employee or manager
//     const feedbacks = await Feedback.find({
//       $or: [
//         { employee: employeeId },
//         { 'employee.id': employeeId },
//         { manager: employeeId },
//         { 'manager.id': employeeId }
//       ]
//     });
    
//     res.status(200).json(feedbacks);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbacksByDepartment = async (req, res) => {
//   try {
//     const { department } = req.params;
    
//     // Find feedbacks where employee or manager is from this department
//     // This assumes employee and manager objects have department field
//     const feedbacks = await Feedback.find({
//       $or: [
//         { 'employee.department': department },
//         { 'manager.department': department }
//       ]
//     });
    
//     res.status(200).json(feedbacks);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbacksOverdue = async (req, res) => {
//   try {
//     const today = new Date();
    
//     // Find feedbacks that are past due date and not completed
//     const overdueFeedbacks = await Feedback.find({
//       dueDate: { $lt: today },
//       status: { $ne: 'Completed' }
//     });
    
//     res.status(200).json(overdueFeedbacks);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getFeedbacksDueThisWeek = async (req, res) => {
//   try {
//     const today = new Date();
//     const oneWeekFromNow = new Date();
//     oneWeekFromNow.setDate(today.getDate() + 7);
    
//     // Find feedbacks due within the next week and not completed
//     const dueThisWeek = await Feedback.find({
//       dueDate: { $gte: today, $lte: oneWeekFromNow },
//       status: { $ne: 'Completed' }
//     });
    
//     res.status(200).json(dueThisWeek);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const bulkUpdateFeedbacks = async (req, res) => {
//   try {
//     const { ids, updateData } = req.body;
    
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: 'Feedback IDs are required' });
//     }
    
//     if (!updateData || Object.keys(updateData).length === 0) {
//       return res.status(400).json({ message: 'Update data is required' });
//     }
    
//     // Update multiple feedbacks
//     const result = await Feedback.updateMany(
//       { _id: { $in: ids } },
//       { $set: updateData }
//     );
    
//     res.status(200).json({ 
//       message: 'Feedbacks updated successfully',
//       modifiedCount: result.modifiedCount
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const bulkDeleteFeedbacks = async (req, res) => {
//   try {
//     const { ids } = req.body;
    
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: 'Feedback IDs are required' });
//     }
    
//     // Delete multiple feedbacks
//     const result = await Feedback.deleteMany({ _id: { $in: ids } });
    
//     res.status(200).json({ 
//       message: 'Feedbacks deleted successfully',
//       deletedCount: result.deletedCount
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// // Add this new function to get feedback by user ID
// export const getFeedbacksByUserId = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // First get the employee ID from the user ID
//     const employee = await Employee.findOne({ userId });
    
//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found for this user ID'
//       });
//     }
    
//     const employeeId = employee.Emp_ID;
    
//     // Get all feedbacks
//     const feedbacks = await Feedback.find();
    
//     // Filter and organize by feedback type and employee ID
//     const organizedFeedbacks = {
//       selfFeedback: feedbacks.filter(f => 
//         f.feedbackType === 'selfFeedback' && 
//         (f.employeeId === employeeId || 
//          (typeof f.employee === 'object' && f.employee.id === employeeId) ||
//          (typeof f.employee === 'string' && f.employee.includes(employeeId)))
//       ),
//       requestedFeedback: feedbacks.filter(f => 
//         f.feedbackType === 'requestedFeedback' && 
//         (f.employeeId === employeeId || 
//          (typeof f.employee === 'object' && f.employee.id === employeeId) ||
//          (typeof f.employee === 'string' && f.employee.includes(employeeId)))
//       ),
//       feedbackToReview: feedbacks.filter(f => 
//         f.feedbackType === 'feedbackToReview'
//       ),
//       anonymousFeedback: feedbacks.filter(f => 
//         f.feedbackType === 'anonymousFeedback'
//       )
//     };
    
//     res.status(200).json({
//       success: true,
//       data: organizedFeedbacks
//     });
//   } catch (error) {
//     console.error('Error fetching feedback by user ID:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };


// export const updateFeedbackReviewStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reviewStatus, reviewedBy, comments } = req.body;
    
//     // Find the feedback to review
//     const reviewFeedback = await Feedback.findById(id);
    
//     if (!reviewFeedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     // Update the review status
//     reviewFeedback.reviewStatus = reviewStatus;
    
//     // Add to history
//     reviewFeedback.history.push({
//       date: new Date(),
//       action: 'Updated',
//       user: reviewedBy || 'System',
//       details: `Review status updated to ${reviewStatus}${comments ? ': ' + comments : ''}`
//     });
    
//     await reviewFeedback.save();
    
//     // If there's an original feedback, update it too
//     if (reviewFeedback.originalFeedbackId) {
//       const originalFeedback = await Feedback.findById(reviewFeedback.originalFeedbackId);
      
//       if (originalFeedback) {
//         // Update the status based on review decision
//         if (reviewStatus === 'Approved') {
//           originalFeedback.status = 'Completed';
//         } else if (reviewStatus === 'Rejected') {
//           originalFeedback.status = 'Pending';
//         }
        
//         // Add to history
//         originalFeedback.history.push({
//           date: new Date(),
//           action: 'Updated',
//           user: reviewedBy || 'System',
//           details: `Feedback review ${reviewStatus.toLowerCase()}${comments ? ': ' + comments : ''}`
//         });
        
//         await originalFeedback.save();
//       }
//     }
    
//     res.status(200).json({ 
//       message: 'Feedback review status updated successfully',
//       data: reviewFeedback
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const completeFeedbackReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { approved, reviewedBy, comments } = req.body;
    
//     // Find the feedback
//     const feedback = await Feedback.findById(id);
    
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     // Update the status based on approval
//     feedback.reviewStatus = approved ? 'Approved' : 'Rejected';
//     feedback.status = approved ? 'Completed' : 'Pending';
    
//     // Add to history
//     feedback.history.push({
//       date: new Date(),
//       action: 'Updated',
//       user: reviewedBy || 'System',
//       details: `Feedback review ${approved ? 'approved' : 'rejected'}${comments ? ': ' + comments : ''}`
//     });
    
//     await feedback.save();
    
//     // If this is a review feedback, update the original
//     if (feedback.originalFeedbackId) {
//       const originalFeedback = await Feedback.findById(feedback.originalFeedbackId);
      
//       if (originalFeedback) {
//         originalFeedback.status = approved ? 'Completed' : 'Pending';
//         originalFeedback.reviewStatus = approved ? 'Approved' : 'Rejected';
        
//         // Add to history
//         originalFeedback.history.push({
//           date: new Date(),
//           action: 'Updated',
//           user: reviewedBy || 'System',
//           details: `Feedback review ${approved ? 'approved' : 'rejected'}${comments ? ': ' + comments : ''}`
//         });
        
//         await originalFeedback.save();
//       }
//     }
    
//     res.status(200).json({ 
//       message: `Feedback ${approved ? 'approved' : 'rejected'} successfully`,
//       data: feedback
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const getLinkedFeedback = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Find the feedback
//     const feedback = await Feedback.findById(id);
    
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     let linkedFeedback;
    
//     // If this is an original feedback, find its reviews
//     if (!feedback.originalFeedbackId) {
//       linkedFeedback = await Feedback.find({ originalFeedbackId: id });
//     } 
//     // If this is a review feedback, find its original
//     else {
//       linkedFeedback = await Feedback.findById(feedback.originalFeedbackId);
//     }
    
//     res.status(200).json({
//       success: true,
//       data: linkedFeedback
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const getFeedbacksToReviewByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // First get the employee ID from the user ID
//     const employee = await Employee.findOne({ userId });
    
//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found for this user ID'
//       });
//     }
    
//     const employeeId = employee.Emp_ID;
    
//     // Find all feedback that this employee should review
//     // This could be based on their role, department, or specific assignment
//     const feedbackToReview = await Feedback.find({
//       feedbackType: 'feedbackToReview',
//       $or: [
//         { 'manager.id': employeeId },
//         { manager: employeeId },
//         { reviewAssignedTo: employeeId }
//       ]
//     });
    
//     res.status(200).json({
//       success: true,
//       data: feedbackToReview
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const assignFeedbackForReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { reviewerId, assignedBy, comments } = req.body;
    
//     // Find the feedback
//     const feedback = await Feedback.findById(id);
    
//     if (!feedback) {
//       return res.status(404).json({ message: 'Feedback not found' });
//     }
    
//     // Update the reviewer
//     feedback.reviewAssignedTo = reviewerId;
    
//     // Add to history
//     feedback.history.push({
//       date: new Date(),
//       action: 'Updated',
//       user: assignedBy || 'System',
//       details: `Assigned for review to ${reviewerId}${comments ? ': ' + comments : ''}`
//     });
    
//     await feedback.save();
    
//     res.status(200).json({
//       success: true,
//       message: 'Feedback assigned for review successfully',
//       data: feedback
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


// export const getFeedbackStatsByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     // First get the employee ID from the user ID
//     const employee = await Employee.findOne({ userId });
    
//     if (!employee) {
//       return res.status(404).json({
//         success: false,
//         message: 'Employee not found for this user ID'
//       });
//     }
    
//     const employeeId = employee.Emp_ID;
    
//     // Get all feedback related to this employee
//     const allFeedback = await Feedback.find({
//       $or: [
//         { employeeId: employeeId },
//         { 'employee.id': employeeId },
//         { employee: employeeId },
//         { 'manager.id': employeeId },
//         { manager: employeeId },
//         { reviewAssignedTo: employeeId },
//         { createdBy: employeeId }
//       ]
//     });
    
//     // Calculate statistics
//     const stats = {
//       total: allFeedback.length,
//       selfFeedback: allFeedback.filter(f => f.feedbackType === 'selfFeedback').length,
//       requestedFeedback: allFeedback.filter(f => f.feedbackType === 'requestedFeedback').length,
//       feedbackToReview: allFeedback.filter(f => f.feedbackType === 'feedbackToReview').length,
//       anonymousFeedback: allFeedback.filter(f => f.feedbackType === 'anonymousFeedback').length,
//       completed: allFeedback.filter(f => f.status === 'Completed').length,
//       inProgress: allFeedback.filter(f => f.status === 'In Progress').length,
//       notStarted: allFeedback.filter(f => f.status === 'Not Started').length,
//       pending: allFeedback.filter(f => f.status === 'Pending').length,
//       overdue: allFeedback.filter(f => 
//         new Date(f.dueDate) < new Date() && f.status !== 'Completed'
//       ).length,
//       completionRate: allFeedback.length > 0 
//         ? ((allFeedback.filter(f => f.status === 'Completed').length / allFeedback.length) * 100).toFixed(1)
//         : 0
//     };
    
//     res.status(200).json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };


import Feedback, { feedbackSchema } from '../models/Feedback.js';
import Employee from '../models/employeeRegisterModel.js';
import getModelForCompany from '../models/genericModelFactory.js';

export const createFeedback = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating feedback for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    const feedbackData = req.body;
    
    // If it's self-feedback that needs review, handle the special workflow
    if (feedbackData.feedbackType === 'selfFeedback' && feedbackData.needsReview) {
      // Create the self-feedback
      const selfFeedback = new CompanyFeedback({
        ...feedbackData,
        feedbackType: 'selfFeedback',
        status: 'In Progress'
      });
      
      // Add initial history entry
      selfFeedback.history = [{
        date: new Date(),
        action: 'Created',
        user: feedbackData.createdBy || 'System',
        details: 'Self feedback created and sent for review'
      }];
      
      await selfFeedback.save();
      
      // Create a copy in the feedbackToReview category
      const reviewFeedback = new CompanyFeedback({
        ...feedbackData,
        feedbackType: 'feedbackToReview',
        originalFeedbackId: selfFeedback._id,
        status: 'Pending',
        history: [{
          date: new Date(),
          action: 'Created',
          user: feedbackData.createdBy || 'System',
          details: 'Feedback submitted for review'
        }]
      });
      
      await reviewFeedback.save();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Feedback created and sent for review',
        data: {
          selfFeedback,
          reviewFeedback
        }
      });
    }
    
    // Regular feedback creation
    const feedback = new CompanyFeedback(feedbackData);
    
    // Add initial history entry
    feedback.history = [{
      date: new Date(),
      action: 'Created',
      user: feedbackData.createdBy || 'System',
      details: 'Feedback created'
    }];
    
    const savedFeedback = await feedback.save();
    res.status(201).json(savedFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error creating feedback'
    });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching all feedbacks for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Extract query parameters
    const { 
      searchTerm, 
      status, 
      employee, 
      manager, 
      startDate, 
      endDate, 
      priority, 
      period,
      sortBy = 'createdAt',
      sortDirection = 'desc',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    let query = {};
    
    if (searchTerm) {
      query.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { 'employee.name': { $regex: searchTerm, $options: 'i' } },
        { employee: { $regex: searchTerm, $options: 'i' } },
        { 'manager.name': { $regex: searchTerm, $options: 'i' } },
        { manager: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (employee) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'employee.name': { $regex: employee, $options: 'i' } },
        { employee: { $regex: employee, $options: 'i' } }
      );
    }
    if (manager) {
      query.$or = query.$or || [];
      query.$or.push(
        { 'manager.name': { $regex: manager, $options: 'i' } },
        { manager: { $regex: manager, $options: 'i' } }
      );
    }
    if (startDate) query.startDate = { $gte: new Date(startDate) };
    if (endDate) query.dueDate = { $lte: new Date(endDate) };
    if (priority) query.priority = priority;
    if (period) query.period = period;
    
    // Count total documents for pagination
    const total = await CompanyFeedback.countDocuments(query);
    
    // Execute query with pagination and sorting
    const feedbacks = await CompanyFeedback.find(query)
      .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    // Organize by feedback type
    const organizedFeedbacks = {
      selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback'),
      requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback'),
      feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview'),
      anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback')
    };
    
    // Set pagination headers
    res.set('X-Total-Count', total);
    res.set('X-Page', page);
    res.set('X-Limit', limit);
    res.set('X-Total-Pages', Math.ceil(total / limit));
    
    res.status(200).json(organizedFeedbacks);
  } catch (error) {
    console.error('Error fetching all feedbacks:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedbacks'
    });
  }
};

export const updateFeedback = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    
    console.log(`Updating feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    const updateData = req.body;
    
    // Get the current feedback to track changes
    const currentFeedback = await CompanyFeedback.findById(id);
    if (!currentFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Track history if status changed
    if (updateData.status && updateData.status !== currentFeedback.status) {
      const historyEntry = {
        date: new Date(),
        action: 'Updated',
        user: updateData.updatedBy || 'System', // In a real app, this would come from auth
        details: `Status changed from ${currentFeedback.status} to ${updateData.status}`
      };
      
      updateData.history = [...currentFeedback.history, historyEntry];
    }
    
    const updatedFeedback = await CompanyFeedback.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    // If this feedback has a linked feedback (original or review), update that too
    if (currentFeedback.originalFeedbackId) {
      // This is a review feedback, update the original
      await CompanyFeedback.findByIdAndUpdate(
        currentFeedback.originalFeedbackId,
        { status: updateData.status },
        { new: false }
      );
    } else {
      // Check if this is an original feedback with reviews
      const linkedReviews = await CompanyFeedback.find({ originalFeedbackId: id });
      
      if (linkedReviews.length > 0) {
        // Update all linked reviews
        await Promise.all(
          linkedReviews.map(review => 
            CompanyFeedback.findByIdAndUpdate(
              review._id,
              { status: updateData.status },
              { new: false }
            )
          )
        );
      }
    }
    
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
        res.status(400).json({ 
      message: error.message,
      error: 'Error updating feedback'
    });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    
    console.log(`Deleting feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Get the feedback to check for linked feedbacks
    const feedback = await CompanyFeedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // If this is an original feedback with reviews, delete those too
    if (!feedback.originalFeedbackId) {
      await CompanyFeedback.deleteMany({ originalFeedbackId: id });
    }
    
    // Delete the feedback
    await CompanyFeedback.findByIdAndDelete(id);
    
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error deleting feedback'
    });
  }
};

export const getFeedbacksByType = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { type } = req.params;
    
    console.log(`Fetching feedbacks of type ${type} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Validate the type
    const validTypes = ['selfFeedback', 'requestedFeedback', 'feedbackToReview', 'anonymousFeedback'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid feedback type' });
    }
    
    const feedbacks = await CompanyFeedback.find({ feedbackType: type });
    
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks by type:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedbacks by type'
    });
  }
};

export const getFeedbackHistory = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    
    console.log(`Fetching history for feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    const feedback = await CompanyFeedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    res.status(200).json(feedback.history || []);
  } catch (error) {
    console.error('Error fetching feedback history:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedback history'
    });
  }
};

export const addFeedbackComment = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { comment, user } = req.body;
    
    console.log(`Adding comment to feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    if (!comment) {
      return res.status(400).json({ message: 'Comment is required' });
    }
    
    const feedback = await CompanyFeedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Add the comment to history
    feedback.addComment({ comment, user });
    await feedback.save();
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error adding feedback comment:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error adding feedback comment'
    });
  }
};

export const getFeedbackAnalytics = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching feedback analytics for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Get counts by type
    const selfFeedbackCount = await CompanyFeedback.countDocuments({ feedbackType: 'selfFeedback' });
    const requestedFeedbackCount = await CompanyFeedback.countDocuments({ feedbackType: 'requestedFeedback' });
    const feedbackToReviewCount = await CompanyFeedback.countDocuments({ feedbackType: 'feedbackToReview' });
    const anonymousFeedbackCount = await CompanyFeedback.countDocuments({ feedbackType: 'anonymousFeedback' });
    
    // Get counts by status
    const notStartedCount = await CompanyFeedback.countDocuments({ status: 'Not Started' });
    const inProgressCount = await CompanyFeedback.countDocuments({ status: 'In Progress' });
    const completedCount = await CompanyFeedback.countDocuments({ status: 'Completed' });
    const pendingCount = await CompanyFeedback.countDocuments({ status: 'Pending' });
    
    // Get counts by priority
    const lowPriorityCount = await CompanyFeedback.countDocuments({ priority: 'Low' });
    const mediumPriorityCount = await CompanyFeedback.countDocuments({ priority: 'Medium' });
    const highPriorityCount = await CompanyFeedback.countDocuments({ priority: 'High' });
    const criticalPriorityCount = await CompanyFeedback.countDocuments({ priority: 'Critical' });
    
    // Get overdue feedbacks
    const overdueCount = await CompanyFeedback.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Completed' }
    });
    
    // Get feedbacks due this week
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    const dueThisWeekCount = await CompanyFeedback.countDocuments({
      dueDate: { $gte: today, $lte: endOfWeek },
      status: { $ne: 'Completed' }
    });
    
    // Compile analytics
    const analytics = {
      total: selfFeedbackCount + requestedFeedbackCount + feedbackToReviewCount + anonymousFeedbackCount,
      byType: {
        selfFeedback: selfFeedbackCount,
        requestedFeedback: requestedFeedbackCount,
        feedbackToReview: feedbackToReviewCount,
        anonymousFeedback: anonymousFeedbackCount
      },
      byStatus: {
        notStarted: notStartedCount,
        inProgress: inProgressCount,
        completed: completedCount,
        pending: pendingCount
      },
      byPriority: {
        low: lowPriorityCount,
        medium: mediumPriorityCount,
        high: highPriorityCount,
        critical: criticalPriorityCount
      },
      overdue: overdueCount,
      dueThisWeek: dueThisWeekCount
    };
    
    res.status(200).json(analytics);
  } catch (error) {
    console.error('Error fetching feedback analytics:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedback analytics'
    });
  }
};

export const submitFeedbackResponse = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { text, rating, submittedBy } = req.body;
    
    console.log(`Submitting response for feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    const feedback = await CompanyFeedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update the response
    feedback.response = {
      text,
      rating,
      submittedBy,
      submittedAt: new Date()
    };
    
    // Add to history
    feedback.history.push({
      date: new Date(),
      action: 'Response Submitted',
      user: submittedBy || 'Anonymous',
      details: `Response submitted with rating: ${rating}/5`
    });
    
    // Update status to completed
    feedback.status = 'Completed';
    
    await feedback.save();
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error submitting feedback response:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error submitting feedback response'
    });
  }
};

export const getFeedbacksByEmployee = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { employeeId } = req.params;
    
    console.log(`Fetching feedbacks for employee ${employeeId} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Find feedbacks where this employee is either the subject or the creator
    const feedbacks = await CompanyFeedback.find({
      $or: [
        { employeeId },
        { createdBy: employeeId }
      ]
    });
    
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks by employee:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedbacks by employee'
    });
  }
};

export const getFeedbacksByDepartment = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { department } = req.params;
    
    console.log(`Fetching feedbacks for department ${department} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Find employees in this department
    const CompanyEmployee = await getModelForCompany(companyCode, 'Employee', Employee.schema);
    const departmentEmployees = await CompanyEmployee.find({ 
      'joiningDetails.department': department 
    });
    
    const employeeIds = departmentEmployees.map(emp => emp.Emp_ID);
    
    // Find feedbacks for these employees
    const feedbacks = await CompanyFeedback.find({
      employeeId: { $in: employeeIds }
    });
    
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks by department:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedbacks by department'
    });
  }
};

export const getFeedbacksOverdue = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching overdue feedbacks for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    const today = new Date();
    
    const overdueFeedbacks = await CompanyFeedback.find({
      dueDate: { $lt: today },
      status: { $ne: 'Completed' }
    });
    
    res.status(200).json(overdueFeedbacks);
  } catch (error) {
    console.error('Error fetching overdue feedbacks:', error);
    res.status(500).json({ 
      message: error.message,
            error: 'Error fetching overdue feedbacks'
    });
  }
};

export const getFeedbacksDueThisWeek = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching feedbacks due this week for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    const dueThisWeekFeedbacks = await CompanyFeedback.find({
      dueDate: { $gte: today, $lte: endOfWeek },
      status: { $ne: 'Completed' }
    });
    
    res.status(200).json(dueThisWeekFeedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks due this week:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedbacks due this week'
    });
  }
};

export const bulkUpdateFeedbacks = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { ids, updateData } = req.body;
    
    console.log(`Bulk updating ${ids.length} feedbacks for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No feedback IDs provided' });
    }
    
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No update data provided' });
    }
    
    // Add history entry for each feedback
    const historyEntry = {
      date: new Date(),
      action: 'Updated',
      user: updateData.updatedBy || 'System',
      details: `Bulk update: ${Object.keys(updateData).join(', ')}`
    };
    
    // Update each feedback individually to handle history properly
    const updatePromises = ids.map(async (id) => {
      const feedback = await CompanyFeedback.findById(id);
      if (!feedback) return null;
      
      // Add history entry
      feedback.history.push(historyEntry);
      
      // Apply updates
      Object.keys(updateData).forEach(key => {
        if (key !== 'updatedBy') {
          feedback[key] = updateData[key];
        }
      });
      
      return feedback.save();
    });
    
    const updatedFeedbacks = await Promise.all(updatePromises);
    const validUpdates = updatedFeedbacks.filter(Boolean);
    
    res.status(200).json({
      message: `${validUpdates.length} feedbacks updated successfully`,
      updatedCount: validUpdates.length,
      feedbacks: validUpdates
    });
  } catch (error) {
    console.error('Error bulk updating feedbacks:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error bulk updating feedbacks'
    });
  }
};

export const bulkDeleteFeedbacks = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { ids } = req.body;
    
    console.log(`Bulk deleting ${ids.length} feedbacks for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'No feedback IDs provided' });
    }
    
    // Delete feedbacks
    const result = await CompanyFeedback.deleteMany({ _id: { $in: ids } });
    
    res.status(200).json({
      message: `${result.deletedCount} feedbacks deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error bulk deleting feedbacks:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error bulk deleting feedbacks'
    });
  }
};

export const getFeedbacksByUserId = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { userId } = req.params;
    
    console.log(`Fetching feedbacks for user ${userId} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Find all feedbacks related to this user
    const feedbacks = await CompanyFeedback.find({
      $or: [
        { employeeId: userId },
        { createdBy: userId },
        { 'manager.id': userId },
        { reviewAssignedTo: userId }
      ]
    });
    
    // Organize by feedback type
    const organizedFeedbacks = {
      selfFeedback: feedbacks.filter(f => f.feedbackType === 'selfFeedback' && f.employeeId === userId),
      requestedFeedback: feedbacks.filter(f => f.feedbackType === 'requestedFeedback' && (f.createdBy === userId || f.employeeId === userId)),
      feedbackToReview: feedbacks.filter(f => f.feedbackType === 'feedbackToReview' && (f.reviewAssignedTo === userId || f.createdBy === userId)),
      anonymousFeedback: feedbacks.filter(f => f.feedbackType === 'anonymousFeedback' && f.employeeId === userId)
    };
    
    res.status(200).json(organizedFeedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks by user ID:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedbacks by user ID'
    });
  }
};

export const updateFeedbackReviewStatus = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { reviewStatus, reviewedBy, comments } = req.body;
    
    console.log(`Updating review status for feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Validate review status
    if (!['Pending', 'Approved', 'Rejected'].includes(reviewStatus)) {
      return res.status(400).json({ message: 'Invalid review status' });
    }
    
    const feedback = await CompanyFeedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update review status
    feedback.reviewStatus = reviewStatus;
    
    // Add to history
    feedback.history.push({
      date: new Date(),
      action: 'Updated',
      user: reviewedBy || 'System',
      details: `Review status changed to ${reviewStatus}${comments ? `: ${comments}` : ''}`
    });
    
    // If there are comments, add them too
    if (comments) {
      feedback.addComment({
        comment: comments,
        user: reviewedBy || 'Reviewer'
      });
    }
    
    await feedback.save();
    
    // If this is a review feedback, update the original feedback too
    if (feedback.originalFeedbackId) {
      const originalFeedback = await CompanyFeedback.findById(feedback.originalFeedbackId);
      if (originalFeedback) {
        originalFeedback.reviewStatus = reviewStatus;
        
        // Add to history
        originalFeedback.history.push({
          date: new Date(),
          action: 'Updated',
          user: reviewedBy || 'System',
          details: `Review status changed to ${reviewStatus}${comments ? `: ${comments}` : ''}`
        });
        
        // If there are comments, add them too
        if (comments) {
          originalFeedback.addComment({
            comment: comments,
            user: reviewedBy || 'Reviewer'
          });
        }
        
        await originalFeedback.save();
      }
    }
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error updating feedback review status:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error updating feedback review status'
    });
  }
};

export const completeFeedbackReview = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { reviewStatus, reviewedBy, comments } = req.body;
    
    console.log(`Completing review for feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Validate review status
    if (!['Approved', 'Rejected'].includes(reviewStatus)) {
      return res.status(400).json({ message: 'Invalid review status. Must be Approved or Rejected' });
    }
    
    const reviewFeedback = await CompanyFeedback.findById(id);
    if (!reviewFeedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update review feedback
    reviewFeedback.reviewStatus = reviewStatus;
    reviewFeedback.status = reviewStatus === 'Approved' ? 'Completed' : 'Rejected';
    
    // Add to history
    reviewFeedback.history.push({
      date: new Date(),
      action: 'Updated',
      user: reviewedBy || 'System',
      details: `Review completed: ${reviewStatus}${comments ? `: ${comments}` : ''}`
    });
    
    // If there are comments, add them too
    if (comments) {
      reviewFeedback.addComment({
        comment: comments,
        user: reviewedBy || 'Reviewer'
      });
    }
    
    await reviewFeedback.save();
    
    // Update the original feedback if it exists
    if (reviewFeedback.originalFeedbackId) {
      const originalFeedback = await CompanyFeedback.findById(reviewFeedback.originalFeedbackId);
      if (originalFeedback) {
        originalFeedback.reviewStatus = reviewStatus;
        originalFeedback.status = reviewStatus === 'Approved' ? 'Completed' : 'Rejected';
        
        // Add to history
        originalFeedback.history.push({
          date: new Date(),
          action: 'Updated',
          user: reviewedBy || 'System',
          details: `Review completed: ${reviewStatus}${comments ? `: ${comments}` : ''}`
        });
        
        // If there are comments, add them too
        if (comments) {
          originalFeedback.addComment({
            comment: comments,
            user: reviewedBy || 'Reviewer'
          });
        }
        
        await originalFeedback.save();
      }
    }
    
    res.status(200).json({
      message: `Feedback review completed with status: ${reviewStatus}`,
      reviewFeedback
    });
  } catch (error) {
    console.error('Error completing feedback review:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error completing feedback review'
    });
  }
};

export const getLinkedFeedback = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    
    console.log(`Fetching linked feedback for feedback ${id} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    const feedback = await CompanyFeedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    let linkedFeedback;
    
    if (feedback.originalFeedbackId) {
      // This is a review feedback, get the original
      linkedFeedback = await CompanyFeedback.findById(feedback.originalFeedbackId);
    } else {
      // This is an original feedback, get the review
      linkedFeedback = await CompanyFeedback.findOne({ originalFeedbackId: id });
    }
    
    if (!linkedFeedback) {
      return res.status(404).json({ message: 'No linked feedback found' });
    }
    
    res.status(200).json(linkedFeedback);
  } catch (error) {
    console.error('Error fetching linked feedback:', error);
    res.status(500).json({ 
           message: error.message,
      error: 'Error fetching linked feedback'
    });
  }
};

export const getFeedbacksToReviewByUser = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { userId } = req.params;
    
    console.log(`Fetching feedbacks to review for user ${userId} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Find all feedbacks assigned to this user for review
    const feedbacks = await CompanyFeedback.find({
      reviewAssignedTo: userId,
      feedbackType: 'feedbackToReview',
      reviewStatus: 'Pending'
    });
    
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks to review by user:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedbacks to review by user'
    });
  }
};

export const assignFeedbackForReview = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    const { reviewAssignedTo, assignedBy } = req.body;
    
    console.log(`Assigning feedback ${id} for review to user ${reviewAssignedTo} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    if (!reviewAssignedTo) {
      return res.status(400).json({ message: 'Review assignee is required' });
    }
    
    const feedback = await CompanyFeedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found' });
    }
    
    // Update the assignee
    feedback.reviewAssignedTo = reviewAssignedTo;
    
    // Add to history
    feedback.history.push({
      date: new Date(),
      action: 'Updated',
      user: assignedBy || 'System',
      details: `Assigned for review to ${reviewAssignedTo}`
    });
    
    await feedback.save();
    
    res.status(200).json(feedback);
  } catch (error) {
    console.error('Error assigning feedback for review:', error);
    res.status(400).json({ 
      message: error.message,
      error: 'Error assigning feedback for review'
    });
  }
};

export const getFeedbackStatsByUser = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { userId } = req.params;
    
    console.log(`Fetching feedback stats for user ${userId} for company: ${companyCode}`);
    
    // Get company-specific Feedback model
    const CompanyFeedback = await getModelForCompany(companyCode, 'Feedback', feedbackSchema);
    
    // Get counts for different types of feedbacks
    const selfFeedbackCount = await CompanyFeedback.countDocuments({
      feedbackType: 'selfFeedback',
      employeeId: userId
    });
    
    const requestedFeedbackCount = await CompanyFeedback.countDocuments({
      feedbackType: 'requestedFeedback',
      $or: [
        { employeeId: userId },
        { createdBy: userId }
      ]
    });
    
    const feedbackToReviewCount = await CompanyFeedback.countDocuments({
      feedbackType: 'feedbackToReview',
      reviewAssignedTo: userId,
      reviewStatus: 'Pending'
    });
    
    const anonymousFeedbackCount = await CompanyFeedback.countDocuments({
      feedbackType: 'anonymousFeedback',
      employeeId: userId
    });
    
    // Get counts by status
    const notStartedCount = await CompanyFeedback.countDocuments({
      status: 'Not Started',
      $or: [
        { employeeId: userId },
        { createdBy: userId },
        { reviewAssignedTo: userId }
      ]
    });
    
    const inProgressCount = await CompanyFeedback.countDocuments({
      status: 'In Progress',
      $or: [
        { employeeId: userId },
        { createdBy: userId },
        { reviewAssignedTo: userId }
      ]
    });
    
    const completedCount = await CompanyFeedback.countDocuments({
      status: 'Completed',
      $or: [
        { employeeId: userId },
        { createdBy: userId },
        { reviewAssignedTo: userId }
      ]
    });
    
    const pendingCount = await CompanyFeedback.countDocuments({
      status: 'Pending',
      $or: [
        { employeeId: userId },
        { createdBy: userId },
        { reviewAssignedTo: userId }
      ]
    });
    
    // Get overdue feedbacks
    const today = new Date();
    const overdueCount = await CompanyFeedback.countDocuments({
      dueDate: { $lt: today },
      status: { $ne: 'Completed' },
      $or: [
        { employeeId: userId },
        { createdBy: userId },
        { reviewAssignedTo: userId }
      ]
    });
    
    // Get feedbacks due this week
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    
    const dueThisWeekCount = await CompanyFeedback.countDocuments({
      dueDate: { $gte: today, $lte: endOfWeek },
      status: { $ne: 'Completed' },
      $or: [
        { employeeId: userId },
        { createdBy: userId },
        { reviewAssignedTo: userId }
      ]
    });
    
    // Compile stats
    const stats = {
      total: selfFeedbackCount + requestedFeedbackCount + feedbackToReviewCount + anonymousFeedbackCount,
      byType: {
        selfFeedback: selfFeedbackCount,
        requestedFeedback: requestedFeedbackCount,
        feedbackToReview: feedbackToReviewCount,
        anonymousFeedback: anonymousFeedbackCount
      },
      byStatus: {
        notStarted: notStartedCount,
        inProgress: inProgressCount,
        completed: completedCount,
        pending: pendingCount
      },
      overdue: overdueCount,
      dueThisWeek: dueThisWeekCount
    };
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching feedback stats by user:', error);
    res.status(500).json({ 
      message: error.message,
      error: 'Error fetching feedback stats by user'
    });
  }
};
 







