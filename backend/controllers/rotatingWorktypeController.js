// import RotatingWorktype from '../models/RotatingWorktype.js';
// import Notification from '../models/Notification.js';

// // Get all worktypes with filtering options
// export const getAllWorktypes = async (req, res) => {
//   try {
//     const { isForReview, userId } = req.query;
    
//     let query = {};
    
//     // If userId is provided, filter by user
//     if (userId) {
//       query.userId = userId;
//     }
    
//     // If isForReview is provided, filter by review status
//     if (isForReview !== undefined) {
//       query.isForReview = isForReview === 'true';
//     }
    
//     const worktypes = await RotatingWorktype.find(query).sort('-createdAt');
//     res.status(200).json(worktypes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get worktypes for a specific user
// export const getUserWorktypes = async (req, res) => {
//   try {
//     const { userId } = req.params;
    
//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
    
//     const worktypes = await RotatingWorktype.find({ 
//       userId: userId 
//     }).sort('-createdAt');
    
//     res.status(200).json(worktypes);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new worktype request
// export const createWorktype = async (req, res) => {
//   try {
//     // Ensure userId is provided
//     if (!req.body.userId) {
//       return res.status(400).json({ message: 'User ID is required' });
//     }
    
//     const newWorktype = new RotatingWorktype(req.body);
//     const savedWorktype = await newWorktype.save();
//     res.status(201).json(savedWorktype);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Update a worktype request
// export const updateWorktype = async (req, res) => {
//   try {
//     // Check if the user owns this request (if userId is provided)
//     if (req.body.userId) {
//       const worktype = await RotatingWorktype.findById(req.params.id);
      
//       if (!worktype) {
//         return res.status(404).json({ message: 'Worktype request not found' });
//       }
      
//       // Only allow updates if the user owns the request or is an admin
//       // Note: You might want to add admin check here based on your auth system
//       if (worktype.userId !== req.body.userId) {
//         return res.status(403).json({ 
//           message: 'You do not have permission to update this request' 
//         });
//       }
//     }
    
//     const updatedWorktype = await RotatingWorktype.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true }
//     );
    
//     if (!updatedWorktype) {
//       return res.status(404).json({ message: 'Worktype request not found' });
//     }
    
//     res.status(200).json(updatedWorktype);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a worktype request
// export const deleteWorktype = async (req, res) => {
//   try {
//     const { userId } = req.query;
    
//     // If userId is provided, check ownership
//     if (userId) {
//       const worktype = await RotatingWorktype.findById(req.params.id);
      
//       if (!worktype) {
//         return res.status(404).json({ message: 'Worktype request not found' });
//       }
      
//       // Only allow deletion if the user owns the request or is an admin
//       if (worktype.userId !== userId) {
//         return res.status(403).json({ 
//           message: 'You do not have permission to delete this request' 
//         });
//       }
//     }
    
//     const deletedWorktype = await RotatingWorktype.findByIdAndDelete(req.params.id);
    
//     if (!deletedWorktype) {
//       return res.status(404).json({ message: 'Worktype request not found' });
//     }
    
//     res.status(200).json({ message: 'Worktype request deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Approve a worktype request
// export const approveWorktype = async (req, res) => {
//   try {
//     const worktype = await RotatingWorktype.findById(req.params.id);
    
//     if (!worktype) {
//       return res.status(404).json({ message: 'Worktype request not found' });
//     }
    
//     // Update the worktype with approved status and reviewer info
//     const updatedWorktype = await RotatingWorktype.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status: 'Approved',
//         isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
//         reviewerName: req.body.reviewerName || 'Admin',
//         reviewedAt: new Date()
//       },
//       { new: true }
//     );
    
//     // Create notification for the user
//     if (worktype.userId) {
//       try {
//         // Create notification message
//         const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been approved`;
        
//         // Create notification in database
//         const notification = new Notification({
//           message: notificationMessage,
//           type: 'rotating-worktype',
//           userId: worktype.userId,
//           status: 'approved',
//           read: false,
//           time: new Date()
//         });
        
//         await notification.save();
        
//         // Get the io instance from the request app
//         const io = req.app.get('io');
        
//         if (io) {
//           // Emit to the specific user's room
//           io.to(worktype.userId).emit('new-notification', notification);
//         }
//       } catch (notificationError) {
//         console.error('Error creating notification:', notificationError);
//       }
//     }
    
//     res.status(200).json(updatedWorktype);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Reject a worktype request
// export const rejectWorktype = async (req, res) => {
//   try {
//     const worktype = await RotatingWorktype.findById(req.params.id);
    
//     if (!worktype) {
//       return res.status(404).json({ message: 'Worktype request not found' });
//     }
    
//     // Update the worktype with rejected status and reviewer info
//     const updatedWorktype = await RotatingWorktype.findByIdAndUpdate(
//       req.params.id,
//       { 
//         status: 'Rejected',
//         isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
//         reviewerName: req.body.reviewerName || 'Admin',
//         reviewedAt: new Date()
//       },
//       { new: true }
//     );
    
//     // Create notification for the user
//     if (worktype.userId) {
//       try {
//         // Create notification message
//         const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been rejected`;
        
//         // Create notification in database
//         const notification = new Notification({
//           message: notificationMessage,
//           type: 'rotating-worktype',
//           userId: worktype.userId,
//           status: 'rejected',
//           read: false,
//           time: new Date()
//         });
        
//         await notification.save();
        
//         // Get the io instance from the request app
//         const io = req.app.get('io');
        
//         if (io) {
//           // Emit to the specific user's room
//           io.to(worktype.userId).emit('new-notification', notification);
//         }
//       } catch (notificationError) {
//         console.error('Error creating notification:', notificationError);
//       }
//     }
    
//     res.status(200).json(updatedWorktype);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Bulk approve worktype requests
// export const bulkApprove = async (req, res) => {
//   try {
//     const { ids, reviewerName } = req.body;
    
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: 'No request IDs provided' });
//     }
    
//     // Get all worktypes to be approved for notification purposes
//     const worktypes = await RotatingWorktype.find({ _id: { $in: ids } });
    
//     // Update all worktypes
//     const result = await RotatingWorktype.updateMany(
//       { _id: { $in: ids } },
//       { 
//         status: 'Approved',
//         isForReview: false,
//         reviewerName: reviewerName || 'Admin',
//         reviewedAt: new Date()
//       }
//     );
    
//     // Create notifications for each user
//     const notifications = [];
//     for (const worktype of worktypes) {
//       if (worktype.userId) {
//         try {
//           // Create notification message
//           const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been approved`;
          
//           // Create notification in database
//           const notification = new Notification({
//             message: notificationMessage,
//             type: 'rotating-worktype',
//             userId: worktype.userId,
//             status: 'approved',
//             read: false,
//             time: new Date()
//           });
          
//           await notification.save();
//           notifications.push(notification);
          
//           // Get the io instance from the request app
//           const io = req.app.get('io');
          
//           if (io) {
//             // Emit to the specific user's room
//             io.to(worktype.userId).emit('new-notification', notification);
//           }
//         } catch (notificationError) {
//           console.error('Error creating notification:', notificationError);
//         }
//       }
//     }
    
//     res.status(200).json({ 
//       message: 'Worktypes approved successfully',
//       count: result.modifiedCount,
//       notifications: notifications.length
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Bulk reject worktype requests
// export const bulkReject = async (req, res) => {
//   try {
//     const { ids, reviewerName } = req.body;
    
//     if (!ids || !Array.isArray(ids) || ids.length === 0) {
//       return res.status(400).json({ message: 'No request IDs provided' });
//     }
    
//     // Get all worktypes to be rejected for notification purposes
//     const worktypes = await RotatingWorktype.find({ _id: { $in: ids } });
    
//     // Update all worktypes
//     const result = await RotatingWorktype.updateMany(
//       { _id: { $in: ids } },
//       { 
//         status: 'Rejected',
//         isForReview: false,
//         reviewerName: reviewerName || 'Admin',
//         reviewedAt: new Date()
//       }
//     );
    
//     // Create notifications for each user
//     const notifications = [];
//     for (const worktype of worktypes) {
//       if (worktype.userId) {
//         try {
//           // Create notification message
//           const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been rejected`;
          
//           // Create notification in database
//           const notification = new Notification({
//             message: notificationMessage,
//             type: 'rotating-worktype',
//             userId: worktype.userId,
//             status: 'rejected',
//             read: false,
//             time: new Date()
//           });
          
//           await notification.save();
//           notifications.push(notification);
          
//           // Get the io instance from the request app
//           const io = req.app.get('io');
          
//           if (io) {
//             // Emit to the specific user's room
//             io.to(worktype.userId).emit('new-notification', notification);
//           }
//         } catch (notificationError) {
//           console.error('Error creating notification:', notificationError);
//         }
//       }
//     }
    
//     res.status(200).json({ 
//       message: 'Worktypes rejected successfully',
//       count: result.modifiedCount,
//       notifications: notifications.length
//     });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

import RotatingWorktype, { rotatingWorktypeSchema } from '../models/RotatingWorktype.js';
import Notification from '../models/Notification.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Get all worktypes with filtering options
export const getAllWorktypes = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching worktypes for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const { isForReview, userId } = req.query;
    
    let query = {};
    
    // If userId is provided, filter by user
    if (userId) {
      query.userId = userId;
    }
    
    // If isForReview is provided, filter by review status
    if (isForReview !== undefined) {
      query.isForReview = isForReview === 'true';
    }
    
    const worktypes = await CompanyRotatingWorktype.find(query).sort('-createdAt');
    res.status(200).json(worktypes);
  } catch (error) {
    console.error('Error fetching worktypes:', error);
    res.status(500).json({ 
      error: 'Error fetching worktypes', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get worktypes for a specific user
export const getUserWorktypes = async (req, res) => {
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
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'User ID is required' 
      });
    }
    
    console.log(`Fetching worktypes for user ${userId} in company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const worktypes = await CompanyRotatingWorktype.find({ 
      userId: userId 
    }).sort('-createdAt');
    
    res.status(200).json(worktypes);
  } catch (error) {
    console.error('Error fetching user worktypes:', error);
    res.status(500).json({ 
      error: 'Error fetching user worktypes', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Create a new worktype request
export const createWorktype = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    // Ensure userId is provided
    if (!req.body.userId) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'User ID is required' 
      });
    }
    
    console.log(`Creating worktype for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const newWorktype = new CompanyRotatingWorktype(req.body);
    const savedWorktype = await newWorktype.save();
    res.status(201).json(savedWorktype);
  } catch (error) {
    console.error('Error creating worktype:', error);
    res.status(400).json({ 
      error: 'Error creating worktype', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a worktype request
export const updateWorktype = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Updating worktype for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    // Check if the user owns this request (if userId is provided)
    if (req.body.userId) {
      const worktype = await CompanyRotatingWorktype.findById(req.params.id);
      
      if (!worktype) {
        return res.status(404).json({ 
          error: 'Not found', 
          message: 'Worktype request not found' 
        });
      }
      
      // Only allow updates if the user owns the request or is an admin
      // Note: You might want to add admin check here based on your auth system
      if (worktype.userId !== req.body.userId) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You do not have permission to update this request' 
        });
      }
    }
    
    const updatedWorktype = await CompanyRotatingWorktype.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedWorktype) {
      return res.status(404).json({ 
        error: 'Not found', 
        message: 'Worktype request not found' 
      });
    }
    
    res.status(200).json(updatedWorktype);
  } catch (error) {
    console.error('Error updating worktype:', error);
    res.status(400).json({ 
      error: 'Error updating worktype', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a worktype request
export const deleteWorktype = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Deleting worktype for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const { userId } = req.query;
    
    // If userId is provided, check ownership
    if (userId) {
      const worktype = await CompanyRotatingWorktype.findById(req.params.id);
      
      if (!worktype) {
        return res.status(404).json({ 
          error: 'Not found', 
          message: 'Worktype request not found' 
        });
      }
      
      // Only allow deletion if the user owns the request or is an admin
      if (worktype.userId !== userId) {
        return res.status(403).json({ 
          error: 'Forbidden', 
          message: 'You do not have permission to delete this request' 
        });
      }
    }
    
    const deletedWorktype = await CompanyRotatingWorktype.findByIdAndDelete(req.params.id);
    
    if (!deletedWorktype) {
      return res.status(404).json({ 
        error: 'Not found', 
        message: 'Worktype request not found' 
      });
    }
    
    res.status(200).json({ message: 'Worktype request deleted successfully' });
  } catch (error) {
    console.error('Error deleting worktype:', error);
    res.status(400).json({ 
      error: 'Error deleting worktype', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Approve a worktype request
export const approveWorktype = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Approving worktype for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const worktype = await CompanyRotatingWorktype.findById(req.params.id);
    
    if (!worktype) {
      return res.status(404).json({ 
        error: 'Not found', 
        message: 'Worktype request not found' 
      });
    }
    
    // Update the worktype with approved status and reviewer info
    const updatedWorktype = await CompanyRotatingWorktype.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Approved',
        isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
        reviewerName: req.body.reviewerName || 'Admin',
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    // Create notification for the user
    if (worktype.userId) {
      try {
        // Create notification message
        const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been approved`;
        
        // Create notification in database
        const notification = new Notification({
          message: notificationMessage,
          type: 'rotating-worktype',
          userId: worktype.userId,
          status: 'approved',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(worktype.userId).emit('new-notification', notification);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(updatedWorktype);
  } catch (error) {
    console.error('Error approving worktype:', error);
    res.status(400).json({ 
      error: 'Error approving worktype', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Reject a worktype request
export const rejectWorktype = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Rejecting worktype for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const worktype = await CompanyRotatingWorktype.findById(req.params.id);
    
    if (!worktype) {
      return res.status(404).json({ 
        error: 'Not found', 
        message: 'Worktype request not found' 
      });
    }
    
        // Update the worktype with rejected status and reviewer info
    const updatedWorktype = await CompanyRotatingWorktype.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'Rejected',
        isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
        reviewerName: req.body.reviewerName || 'Admin',
        reviewedAt: new Date()
      },
      { new: true }
    );
    
    // Create notification for the user
    if (worktype.userId) {
      try {
        // Create notification message
        const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been rejected`;
        
        // Create notification in database
        const notification = new Notification({
          message: notificationMessage,
          type: 'rotating-worktype',
          userId: worktype.userId,
          status: 'rejected',
          read: false,
          time: new Date()
        });
        
        await notification.save();
        
        // Get the io instance from the request app
        const io = req.app.get('io');
        
        if (io) {
          // Emit to the specific user's room
          io.to(worktype.userId).emit('new-notification', notification);
        }
      } catch (notificationError) {
        console.error('Error creating notification:', notificationError);
      }
    }
    
    res.status(200).json(updatedWorktype);
  } catch (error) {
    console.error('Error rejecting worktype:', error);
    res.status(400).json({ 
      error: 'Error rejecting worktype', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Bulk approve worktype requests
export const bulkApproveWorktypes = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Bulk approving worktypes for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'No worktype IDs provided for bulk approval' 
      });
    }
    
    // First get all worktypes to send notifications
    const worktypes = await CompanyRotatingWorktype.find({ _id: { $in: ids } });
    
    // Update all worktypes
    await CompanyRotatingWorktype.updateMany(
      { _id: { $in: ids } },
      { 
        status: 'Approved',
        isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
        reviewerName: req.body.reviewerName || 'Admin',
        reviewedAt: new Date()
      }
    );
    
    // Send notifications for each worktype
    const io = req.app.get('io');
    
    for (const worktype of worktypes) {
      if (worktype.userId) {
        try {
          const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been approved`;
          
          const notification = new Notification({
            message: notificationMessage,
            type: 'rotating-worktype',
            userId: worktype.userId,
            status: 'approved',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          
          if (io) {
            io.to(worktype.userId).emit('new-notification', notification);
          }
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    }
    
    res.status(200).json({ message: `${ids.length} worktype requests approved successfully` });
  } catch (error) {
    console.error('Error bulk approving worktypes:', error);
    res.status(400).json({ 
      error: 'Error bulk approving worktypes', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Bulk reject worktype requests
export const bulkRejectWorktypes = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Bulk rejecting worktypes for company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'No worktype IDs provided for bulk rejection' 
      });
    }
    
    // First get all worktypes to send notifications
    const worktypes = await CompanyRotatingWorktype.find({ _id: { $in: ids } });
    
    // Update all worktypes
    await CompanyRotatingWorktype.updateMany(
      { _id: { $in: ids } },
      { 
        status: 'Rejected',
        isForReview: req.body.isForReview !== undefined ? req.body.isForReview : false,
        reviewerName: req.body.reviewerName || 'Admin',
        reviewedAt: new Date()
      }
    );
    
    // Send notifications for each worktype
    const io = req.app.get('io');
    
    for (const worktype of worktypes) {
      if (worktype.userId) {
        try {
          const notificationMessage = `Your ${worktype.requestedWorktype} worktype request from ${new Date(worktype.requestedDate).toLocaleDateString()} to ${new Date(worktype.requestedTill).toLocaleDateString()} has been rejected`;
          
          const notification = new Notification({
            message: notificationMessage,
            type: 'rotating-worktype',
            userId: worktype.userId,
            status: 'rejected',
            read: false,
            time: new Date()
          });
          
          await notification.save();
          
          if (io) {
            io.to(worktype.userId).emit('new-notification', notification);
          }
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      }
    }
    
    res.status(200).json({ message: `${ids.length} worktype requests rejected successfully` });
  } catch (error) {
    console.error('Error bulk rejecting worktypes:', error);
    res.status(400).json({ 
      error: 'Error bulk rejecting worktypes', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get worktype requests by employee code
export const getWorktypesByEmployeeCode = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { employeeCode } = req.params;
    
    if (!employeeCode) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Employee code is required' 
      });
    }
    
    console.log(`Fetching worktypes for employee ${employeeCode} in company: ${companyCode}`);
    
    // Get company-specific RotatingWorktype model
    const CompanyRotatingWorktype = await getModelForCompany(companyCode, 'RotatingWorktype', rotatingWorktypeSchema);
    
    const worktypes = await CompanyRotatingWorktype.find({ 
      employeeCode: employeeCode 
    }).sort('-createdAt');
    
    res.status(200).json(worktypes);
  } catch (error) {
    console.error('Error fetching employee worktypes:', error);
    res.status(500).json({ 
      error: 'Error fetching employee worktypes', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

