// import Policy from '../models/Policy.js';

// export const policyController = {
//   // Get all policies
//   getAllPolicies: async (req, res) => {
//     try {
//       const policies = await Policy.find().sort({ createdAt: -1 });
//       res.status(200).json(policies);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   },

//   // Create new policy
//   createPolicy: async (req, res) => {
//     try {
//       const newPolicy = new Policy({
//         title: req.body.title,
//         content: req.body.content
//       });
//       const savedPolicy = await newPolicy.save();
//       res.status(201).json(savedPolicy);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   },

//   // Update policy
//   updatePolicy: async (req, res) => {
//     try {
//       const updatedPolicy = await Policy.findByIdAndUpdate(
//         req.params.id,
//         {
//           ...req.body,
//           updatedAt: Date.now()
//         },
//         { new: true }
//       );
//       if (!updatedPolicy) {
//         return res.status(404).json({ message: 'Policy not found' });
//       }
//       res.status(200).json(updatedPolicy);
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   },

//   // Delete policy
//   deletePolicy: async (req, res) => {
//     try {
//       const deletedPolicy = await Policy.findByIdAndDelete(req.params.id);
//       if (!deletedPolicy) {
//         return res.status(404).json({ message: 'Policy not found' });
//       }
//       res.status(200).json({ message: 'Policy deleted successfully' });
//     } catch (error) {
//       res.status(400).json({ message: error.message });
//     }
//   }
// };


import Policy, { policySchema } from '../models/Policy.js';
import getModelForCompany from '../models/genericModelFactory.js';

export const policyController = {
  // Get all policies
  getAllPolicies: async (req, res) => {
    try {
      // Get company code from authenticated user
      const companyCode = req.companyCode;
      
      if (!companyCode) {
        return res.status(401).json({ 
          error: 'Authentication required', 
          message: 'Company code not found in request' 
        });
      }
      
      console.log(`Fetching policies for company: ${companyCode}`);
      
      // Get company-specific Policy model
      const CompanyPolicy = await getModelForCompany(companyCode, 'Policy', policySchema);
      
      // Get policies from company database
      const policies = await CompanyPolicy.find().sort({ createdAt: -1 });
      
      console.log(`Retrieved ${policies.length} policies for company ${companyCode}`);
      res.status(200).json(policies);
    } catch (error) {
      console.error(`Error fetching policies for company ${req.companyCode}:`, error);
      res.status(500).json({ 
        error: 'Error fetching policies', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Create new policy
  createPolicy: async (req, res) => {
    try {
      // Get company code from authenticated user
      const companyCode = req.companyCode;
      
      if (!companyCode) {
        return res.status(401).json({ 
          error: 'Authentication required', 
          message: 'Company code not found in request' 
        });
      }
      
      console.log(`Creating policy for company: ${companyCode}`);
      
      // Get company-specific Policy model
      const CompanyPolicy = await getModelForCompany(companyCode, 'Policy', policySchema);
      
      // Validate required fields
      const { title, content } = req.body;
      if (!title || !content) {
        return res.status(400).json({
          error: 'Validation error',
          message: 'Missing required fields: title and content are required'
        });
      }
      
      // Create new policy in company database
      const newPolicy = new CompanyPolicy({
        title: req.body.title,
        content: req.body.content
      });
      
      const savedPolicy = await newPolicy.save();
      
      console.log(`Policy created successfully: ${req.body.title}`);
      res.status(201).json(savedPolicy);
    } catch (error) {
      console.error('Error creating policy:', error);
      
      // Handle specific MongoDB errors
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          error: 'Validation error',
          message: error.message,
          details: Object.values(error.errors).map(err => err.message)
        });
      }
      
      if (error.name === 'MongoServerError' && error.code === 11000) {
        return res.status(409).json({
          error: 'Duplicate entry',
          message: 'A policy with this title already exists'
        });
      }
      
      res.status(500).json({ 
        error: 'Error creating policy', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Update policy
  updatePolicy: async (req, res) => {
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
          message: 'Policy ID is required' 
        });
      }
      
      console.log(`Updating policy ${id} for company: ${companyCode}`);
      
      // Get company-specific Policy model
      const CompanyPolicy = await getModelForCompany(companyCode, 'Policy', policySchema);
      
      // Update policy in company database with validation
      const updatedPolicy = await CompanyPolicy.findByIdAndUpdate(
        id, 
        {
          ...req.body,
          updatedAt: Date.now()
        }, 
        { 
          new: true,
          runValidators: true // This ensures validation runs on update
        }
      );
      
      if (!updatedPolicy) {
        return res.status(404).json({ 
          error: 'Policy not found',
          message: `No policy found with ID: ${id}`
        });
      }
      
      console.log(`Policy ${id} updated successfully`);
      res.status(200).json(updatedPolicy);
    } catch (error) {
      console.error(`Error updating policy ${req.params.id}:`, error);
      
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
          message: 'The provided policy ID is not valid'
        });
      }
      
      res.status(500).json({ 
        error: 'Error updating policy', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

  // Delete policy
  deletePolicy: async (req, res) => {
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
          message: 'Policy ID is required' 
        });
      }
      
      console.log(`Deleting policy ${id} for company: ${companyCode}`);
      
      // Get company-specific Policy model
      const CompanyPolicy = await getModelForCompany(companyCode, 'Policy', policySchema);
      
      // Delete policy from company database
      const deletedPolicy = await CompanyPolicy.findByIdAndDelete(id);
      
      if (!deletedPolicy) {
        return res.status(404).json({ 
          error: 'Policy not found',
          message: `No policy found with ID: ${id}`
        });
      }
      
      console.log(`Policy ${id} deleted successfully`);
      res.status(200).json({ message: 'Policy deleted successfully' });
    } catch (error) {
      console.error(`Error deleting policy ${req.params.id}:`, error);
      
      if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({
          error: 'Invalid ID',
          message: 'The provided policy ID is not valid'
        });
      }
      
      res.status(500).json({ 
        error: 'Error deleting policy', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
};
