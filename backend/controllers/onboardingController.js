import Onboarding, { onboardingSchema } from '../models/Onboarding.js';
import getModelForCompany from '../models/genericModelFactory.js';
import { sendOnboardingEmail } from '../utils/mailer.js';
import Company from '../models/Company.js';

// Get all candidates
export const getCandidates = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching onboarding candidates for company: ${companyCode}`);
    
    // Get company-specific Onboarding model
    const CompanyOnboarding = await getModelForCompany(companyCode, 'Onboarding', onboardingSchema);
    
    // Get candidates from company database
    const candidates = await CompanyOnboarding.find();
    
    console.log(`Retrieved ${candidates.length} onboarding candidates for company ${companyCode}`);
    res.status(200).json(candidates);
  } catch (error) {
    console.error(`Error fetching onboarding candidates for company ${req.companyCode}:`, error);
    res.status(500).json({ 
      error: 'Error fetching candidates', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Create new candidate
export const createCandidate = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating onboarding candidate for company: ${companyCode}`);
    
    // Get company-specific Onboarding model
    const CompanyOnboarding = await getModelForCompany(companyCode, 'Onboarding', onboardingSchema);
    
    // Validate required fields
    const { name, email, jobPosition, mobile, joiningDate } = req.body;
    if (!name || !email || !jobPosition || !mobile || !joiningDate) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: name, email, jobPosition, mobile, and joiningDate are required'
      });
    }
    
    const candidateData = {
      name: req.body.name,
      email: req.body.email,
      jobPosition: req.body.jobPosition,
      mobile: req.body.mobile,
      joiningDate: new Date(req.body.joiningDate),
      stage: req.body.stage || 'Test',
      portalStatus: req.body.portalStatus || 'Active',
      taskStatus: req.body.taskStatus || 'Pending'
    };
    
    // Create new candidate in company database
    const newCandidate = new CompanyOnboarding(candidateData);
    const savedCandidate = await newCandidate.save();
    
    console.log(`Onboarding candidate created successfully: ${req.body.name}`);
    res.status(201).json(savedCandidate);
  } catch (error) {
    console.error('Error creating onboarding candidate:', error);
    
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
        message: 'A candidate with these details already exists'
      });
    }
    
    res.status(500).json({ 
      error: 'Error creating candidate', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update candidate
export const updateCandidate = async (req, res) => {
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
        message: 'Candidate ID is required' 
      });
    }
    
    console.log(`Updating onboarding candidate ${id} for company: ${companyCode}`);
    
    // Get company-specific Onboarding model
    const CompanyOnboarding = await getModelForCompany(companyCode, 'Onboarding', onboardingSchema);
    
    // Update candidate in company database with validation
    const updatedCandidate = await CompanyOnboarding.findByIdAndUpdate(
      id, 
      req.body, 
      { 
        new: true,
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!updatedCandidate) {
      return res.status(404).json({ 
        error: 'Candidate not found',
        message: `No candidate found with ID: ${id}`
      });
    }
    
    console.log(`Onboarding candidate ${id} updated successfully`);
    res.status(200).json(updatedCandidate);
  } catch (error) {
    console.error(`Error updating onboarding candidate ${req.params.id}:`, error);
    
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
        message: 'The provided candidate ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error updating candidate', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete candidate
export const deleteCandidate = async (req, res) => {
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
        message: 'Candidate ID is required' 
      });
    }
    
    console.log(`Deleting onboarding candidate ${id} for company: ${companyCode}`);
    
    // Get company-specific Onboarding model
    const CompanyOnboarding = await getModelForCompany(companyCode, 'Onboarding', onboardingSchema);
    
    // Delete candidate from company database
    const deletedCandidate = await CompanyOnboarding.findByIdAndDelete(id);
    
    if (!deletedCandidate) {
      return res.status(404).json({ 
        error: 'Candidate not found',
        message: `No candidate found with ID: ${id}`
      });
    }
    
    console.log(`Onboarding candidate ${id} deleted successfully`);
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    console.error(`Error deleting onboarding candidate ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided candidate ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error deleting candidate', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// // Send email notification
// export const sendEmail = async (req, res) => {
//   try {
//     // Get company code from authenticated user
//     const companyCode = req.companyCode;
    
//     if (!companyCode) {
//       return res.status(401).json({ 
//         error: 'Authentication required', 
//         message: 'Company code not found in request' 
//       });
//     }
    
//     const { email, name, jobPosition, joiningDate } = req.body;
    
//     if (!email || !name || !jobPosition || !joiningDate) {
//       return res.status(400).json({
//         error: 'Validation error',
//         message: 'Missing required fields: email, name, jobPosition, and joiningDate are required'
//       });
//     }
    
//     console.log(`Sending onboarding email to ${email} for company: ${companyCode}`);
    
//     await sendOnboardingEmail(email, {
//       name,
//       jobPosition,
//       joiningDate: new Date(joiningDate).toLocaleDateString()
//     });
    
//     console.log(`Onboarding email sent successfully to ${email}`);
//     res.status(200).json({ message: 'Email sent successfully' });
//   } catch (error) {
//     console.error('Error sending onboarding email:', error);
//     res.status(500).json({ 
//       error: 'Error sending email', 
//       message: error.message,
//       stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
//     });
//   }
// };

// Send email notification
export const sendEmail = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { email, name, jobPosition, joiningDate } = req.body;
    
    if (!email || !name || !jobPosition || !joiningDate) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: email, name, jobPosition, and joiningDate are required'
      });
    }
    
    console.log(`Sending onboarding email to ${email} for company: ${companyCode}`);
    
    // Fetch company name from the database
    const company = await Company.findOne({ companyCode });
    const companyName = company ? company.name : 'Our Company';
    
    await sendOnboardingEmail(email, {
      name,
      jobPosition,
      joiningDate: new Date(joiningDate).toLocaleDateString(),
      companyName // Pass the company name to the email function
    });
    
    console.log(`Onboarding email sent successfully to ${email}`);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending onboarding email:', error);
    res.status(500).json({ 
      error: 'Error sending email', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Filter candidates by stage
export const filterByStage = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { stage } = req.query;
    console.log(`Filtering onboarding candidates by stage: ${stage} for company: ${companyCode}`);
    
    // Get company-specific Onboarding model
    const CompanyOnboarding = await getModelForCompany(companyCode, 'Onboarding', onboardingSchema);
    
    // Filter candidates by stage
    const query = stage === 'All' ? {} : { stage };
    const candidates = await CompanyOnboarding.find(query);
    
    console.log(`Retrieved ${candidates.length} filtered onboarding candidates for company ${companyCode}`);
    res.status(200).json(candidates);
  } catch (error) {
    console.error(`Error filtering onboarding candidates for company ${req.companyCode}:`, error);
    res.status(500).json({ 
      error: 'Error filtering candidates', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
