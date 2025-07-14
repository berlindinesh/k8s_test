// import DisciplinaryAction from '../models/DisciplinaryAction.js';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const uploadDir = 'uploads/disciplinary';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   }
// });

// export const upload = multer({ storage: storage });

// // Get all disciplinary actions with optional filtering
// export const getAllActions = async (req, res) => {
//   try {
//     const { searchQuery, status } = req.query;
    
//     let query = {};
    
//     if (searchQuery) {
//       query = {
//         $or: [
//           { employee: { $regex: searchQuery, $options: 'i' } },
//           { action: { $regex: searchQuery, $options: 'i' } },
//           { description: { $regex: searchQuery, $options: 'i' } },
//           { employeeId: { $regex: searchQuery, $options: 'i' } },
//           { department: { $regex: searchQuery, $options: 'i' } }
//         ]
//       };
//     }
    
//     if (status && status !== 'all') {
//       query.status = status;
//     }
    
//     const actions = await DisciplinaryAction.find(query).sort({ createdAt: -1 });
//     res.json(actions);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new disciplinary action
// export const createAction = async (req, res) => {
//   try {
//     const { employee, action, description, startDate, status, employeeId, email, department, designation } = req.body;
    
//     const newAction = new DisciplinaryAction({
//       employee,
//       action,
//       description,
//       startDate,
//       status,
//       employeeId,
//       email,
//       department,
//       designation
//     });
    
//     if (req.file) {
//       newAction.attachments = {
//         filename: req.file.filename,
//         originalName: req.file.originalname,
//         path: req.file.path
//       };
//     }
    
//     await newAction.save();
//     res.status(201).json(newAction);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Get a single disciplinary action
// export const getAction = async (req, res) => {
//   try {
//     const action = await DisciplinaryAction.findById(req.params.id);
//     if (!action) {
//       return res.status(404).json({ message: 'Action not found' });
//     }
//     res.json(action);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Update a disciplinary action
// export const updateAction = async (req, res) => {
//   try {
//     const { employee, action, description, startDate, status, employeeId, email, department, designation } = req.body;
    
//     const updatedAction = {
//       employee,
//       action,
//       description,
//       startDate,
//       status,
//       employeeId,
//       email,
//       department,
//       designation
//     };
    
//     if (req.file) {
//       // Delete old file if exists
//       const oldAction = await DisciplinaryAction.findById(req.params.id);
//       if (oldAction.attachments && oldAction.attachments.path) {
//         fs.unlink(oldAction.attachments.path, (err) => {
//           if (err) console.error('Error deleting old file:', err);
//         });
//       }
      
//       updatedAction.attachments = {
//         filename: req.file.filename,
//         originalName: req.file.originalname,
//         path: req.file.path
//       };
//     }
    
//     const result = await DisciplinaryAction.findByIdAndUpdate(
//       req.params.id,
//       updatedAction,
//       { new: true }
//     );
    
//     if (!result) {
//       return res.status(404).json({ message: 'Action not found' });
//     }
    
//     res.json(result);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Delete a disciplinary action
// export const deleteAction = async (req, res) => {
//   try {
//     const action = await DisciplinaryAction.findById(req.params.id);
    
//     if (!action) {
//       return res.status(404).json({ message: 'Action not found' });
//     }
    
//     // Delete attachment if exists
//     if (action.attachments && action.attachments.path) {
//       fs.unlink(action.attachments.path, (err) => {
//         if (err) console.error('Error deleting file:', err);
//       });
//     }
    
//     await DisciplinaryAction.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Action deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Download attachment
// export const downloadAttachment = async (req, res) => {
//   try {
//     const { filename } = req.params;
//     const filePath = path.join('uploads/disciplinary', filename);
    
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({ message: 'File not found' });
//     }
    
//     res.download(filePath);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

import DisciplinaryAction, { disciplinaryActionSchema } from '../models/DisciplinaryAction.js';
import getModelForCompany from '../models/genericModelFactory.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get company code from request
    const companyCode = req.companyCode || 'default';
    
    // Create company-specific upload directory
    const uploadDir = `uploads/disciplinary/${companyCode}`;
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

export const upload = multer({ storage: storage });

// Get all disciplinary actions with optional filtering
export const getAllActions = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching disciplinary actions for company: ${companyCode}`);
    
    // Get company-specific DisciplinaryAction model
    const CompanyDisciplinaryAction = await getModelForCompany(companyCode, 'DisciplinaryAction', disciplinaryActionSchema);
    
    const { searchQuery, status } = req.query;
    
    let query = {};
    
    if (searchQuery) {
      query = {
        $or: [
          { employee: { $regex: searchQuery, $options: 'i' } },
          { action: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { employeeId: { $regex: searchQuery, $options: 'i' } },
          { department: { $regex: searchQuery, $options: 'i' } }
        ]
      };
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const actions = await CompanyDisciplinaryAction.find(query).sort({ createdAt: -1 });
    res.json(actions);
  } catch (error) {
    console.error('Error fetching disciplinary actions:', error);
    res.status(500).json({ 
      error: 'Error fetching disciplinary actions', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// // Create a new disciplinary action
// export const createAction = async (req, res) => {
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     if (!companyCode) {
//       return res.status(401).json({ 
//         error: 'Authentication required', 
//         message: 'Company code not found in request' 
//       });
//     }
    
//     console.log(`Creating disciplinary action for company: ${companyCode}`);
    
//     // Get company-specific DisciplinaryAction model
//     const CompanyDisciplinaryAction = await getModelForCompany(companyCode, 'DisciplinaryAction', disciplinaryActionSchema);
    
//     const { employee, action, description, startDate, status, employeeId, email, department, designation } = req.body;
    
//     // Validate required fields
//     if (!employee || !action || !description || !startDate || !status) {
//       return res.status(400).json({
//         error: 'Validation error',
//         message: 'Missing required fields: employee, action, description, startDate, and status are required'
//       });
//     }
    
//     const newAction = new CompanyDisciplinaryAction({
//       employee,
//       action,
//       description,
//       startDate,
//       status,
//       employeeId,
//       email,
//       department,
//       designation
//     });
    
//     if (req.file) {
//       // Update file path to include company code
//       newAction.attachments = {
//         filename: req.file.filename,
//         originalName: req.file.originalname,
//         path: req.file.path
//       };
//     }
    
//     await newAction.save();
//     res.status(201).json(newAction);
//   } catch (error) {
//     console.error('Error creating disciplinary action:', error);
//     res.status(400).json({ 
//       error: 'Error creating disciplinary action', 
//       message: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

export const createAction = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating disciplinary action for company: ${companyCode}`);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    
    // Get company-specific DisciplinaryAction model
    const CompanyDisciplinaryAction = await getModelForCompany(companyCode, 'DisciplinaryAction', disciplinaryActionSchema);
    
    const { employee, action, description, startDate, status, employeeId, email, department, designation } = req.body;
    
    // Validate required fields
    if (!employee || !action || !description || !startDate || !status) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: employee, action, description, startDate, and status are required',
        receivedFields: Object.keys(req.body)
      });
    }
    
    const newAction = new CompanyDisciplinaryAction({
      employee,
      action,
      description,
      startDate,
      status,
      employeeId,
      email,
      department,
      designation
    });
    
    if (req.file) {
      // Update file path to include company code
      newAction.attachments = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }
    
    await newAction.save();
    res.status(201).json(newAction);
  } catch (error) {
    console.error('Error creating disciplinary action:', error);
    res.status(500).json({ 
      error: 'Error creating disciplinary action', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Get a single disciplinary action
export const getAction = async (req, res) => {
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
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Action ID is required' 
      });
    }
    
    console.log(`Fetching disciplinary action ${id} for company: ${companyCode}`);
    
    // Get company-specific DisciplinaryAction model
    const CompanyDisciplinaryAction = await getModelForCompany(companyCode, 'DisciplinaryAction', disciplinaryActionSchema);
    
    const action = await CompanyDisciplinaryAction.findById(id);
    
    if (!action) {
      return res.status(404).json({ 
        error: 'Action not found',
        message: `No disciplinary action found with ID: ${id}`
      });
    }
    
    res.json(action);
  } catch (error) {
    console.error(`Error fetching disciplinary action ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided action ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error fetching disciplinary action', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update a disciplinary action
export const updateAction = async (req, res) => {
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
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Action ID is required' 
      });
    }
    
    console.log(`Updating disciplinary action ${id} for company: ${companyCode}`);
    
    // Get company-specific DisciplinaryAction model
    const CompanyDisciplinaryAction = await getModelForCompany(companyCode, 'DisciplinaryAction', disciplinaryActionSchema);
    
    const { employee, action, description, startDate, status, employeeId, email, department, designation } = req.body;
    
    // Validate required fields
    if (!employee || !action || !description || !startDate || !status) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: employee, action, description, startDate, and status are required'
      });
    }
    
    const updatedAction = {
      employee,
      action,
      description,
      startDate,
      status,
      employeeId,
      email,
      department,
      designation
    };
    
    if (req.file) {
      // Delete old file if exists
      const oldAction = await CompanyDisciplinaryAction.findById(id);
      if (oldAction.attachments && oldAction.attachments.path) {
        fs.unlink(oldAction.attachments.path, (err) => {
          if (err) console.error('Error deleting old file:', err);
        });
      }
      
      // Update file path to include company code
      updatedAction.attachments = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path
      };
    }
    
    const result = await CompanyDisciplinaryAction.findByIdAndUpdate(
      id,
      updatedAction,
      { 
        new: true,
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!result) {
      return res.status(404).json({ 
        error: 'Action not found',
        message: `No disciplinary action found with ID: ${id}`
      });
    }
    
    console.log(`Disciplinary action ${id} updated successfully`);
    res.json(result);
  } catch (error) {
    console.error(`Error updating disciplinary action ${req.params.id}:`, error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided action ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error updating disciplinary action', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a disciplinary action
export const deleteAction = async (req, res) => {
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
    
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Action ID is required' 
      });
    }
    
    console.log(`Deleting disciplinary action ${id} for company: ${companyCode}`);
    
    // Get company-specific DisciplinaryAction model
    const CompanyDisciplinaryAction = await getModelForCompany(companyCode, 'DisciplinaryAction', disciplinaryActionSchema);
    
    const action = await CompanyDisciplinaryAction.findById(id);
    
    if (!action) {
      return res.status(404).json({ 
        error: 'Action not found',
        message: `No disciplinary action found with ID: ${id}`
      });
    }
    
    // Delete attachment if exists
    if (action.attachments && action.attachments.path) {
      fs.unlink(action.attachments.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    
    await CompanyDisciplinaryAction.findByIdAndDelete(id);
    
    console.log(`Disciplinary action ${id} deleted successfully`);
    res.json({ 
      message: 'Disciplinary action deleted successfully',
      deletedAction: {
        id: action._id,
        employee: action.employee
      }
    });
  } catch (error) {
    console.error(`Error deleting disciplinary action ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided action ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error deleting disciplinary action', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Download attachment
export const downloadAttachment = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { filename } = req.params;
    
    if (!filename) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Filename is required' 
      });
    }
    
    console.log(`Downloading attachment ${filename} for company: ${companyCode}`);
    
    // Check in company-specific directory first
    let filePath = path.join(`uploads/disciplinary/${companyCode}`, filename);
    
        // If file doesn't exist in company directory, check in default directory (for backward compatibility)
    if (!fs.existsSync(filePath)) {
      filePath = path.join('uploads/disciplinary', filename);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ 
          error: 'File not found',
          message: 'The requested attachment could not be found'
        });
      }
    }
    
    // Get company-specific DisciplinaryAction model to find original filename
    const CompanyDisciplinaryAction = await getModelForCompany(companyCode, 'DisciplinaryAction', disciplinaryActionSchema);
    
    // Find the action with this attachment to get the original filename
    const action = await CompanyDisciplinaryAction.findOne({ 'attachments.filename': filename });
    
    // Set the original filename for download if available
    const originalName = action && action.attachments ? action.attachments.originalName : filename;
    
    res.download(filePath, originalName);
  } catch (error) {
    console.error(`Error downloading attachment ${req.params.filename}:`, error);
    res.status(500).json({ 
      error: 'Error downloading attachment', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

