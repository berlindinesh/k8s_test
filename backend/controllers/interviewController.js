import Interview, { interviewSchema } from '../models/Interview.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Create a new interview
export const createInterview = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating interview for company: ${companyCode}`);
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Validate required fields
    const { candidate, interviewer, date, time } = req.body;
    if (!candidate || !interviewer || !date || !time) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: candidate, interviewer, date, and time are required'
      });
    }
    
    // Create new interview in company database
    const interview = new CompanyInterview(req.body);
    await interview.save();
    
    console.log(`Interview created successfully for ${req.body.candidate}`);
    res.status(201).json(interview);
  } catch (error) {
    console.error('Error creating interview:', error);
    
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
        message: 'An interview with these details already exists'
      });
    }
    
    res.status(500).json({ 
      error: 'Error creating interview', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get all interviews
export const getInterviews = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching interviews for company: ${companyCode}`);
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Support filtering by status if provided
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Get interviews from company database with optional filtering
    const interviews = await CompanyInterview.find(filter).sort({ date: -1, time: -1 });
    
    console.log(`Retrieved ${interviews.length} interviews for company ${companyCode}`);
    res.json(interviews);
  } catch (error) {
    console.error(`Error fetching interviews for company ${req.companyCode}:`, error);
    res.status(500).json({ 
      error: 'Error fetching interviews', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Update an interview
export const updateInterview = async (req, res) => {
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
        message: 'Interview ID is required' 
      });
    }
    
    console.log(`Updating interview ${id} for company: ${companyCode}`);
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Validate required fields
    const { candidate, interviewer, date, time } = req.body;
    if (!candidate || !interviewer || !date || !time) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: candidate, interviewer, date, and time are required'
      });
    }
    
    // Update interview in company database with validation
    const interview = await CompanyInterview.findByIdAndUpdate(
      id, 
      req.body, 
      { 
        new: true,
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!interview) {
      return res.status(404).json({ 
        error: 'Interview not found',
        message: `No interview found with ID: ${id}`
      });
    }
    
    console.log(`Interview ${id} updated successfully`);
    res.json(interview);
  } catch (error) {
    console.error(`Error updating interview ${req.params.id}:`, error);
    
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
        message: 'The provided interview ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error updating interview', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete an interview
export const deleteInterview = async (req, res) => {
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
        message: 'Interview ID is required' 
      });
    }
    
    console.log(`Deleting interview ${id} for company: ${companyCode}`);
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Delete interview from company database
    const interview = await CompanyInterview.findByIdAndDelete(id);
    
    if (!interview) {
      return res.status(404).json({ 
        error: 'Interview not found',
        message: `No interview found with ID: ${id}`
      });
    }
    
    console.log(`Interview ${id} deleted successfully`);
    res.json({ 
      message: 'Interview deleted successfully',
      deletedInterview: {
        id: interview._id,
        candidate: interview.candidate,
        date: interview.date
      }
    });
  } catch (error) {
    console.error(`Error deleting interview ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided interview ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error deleting interview', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Get a single interview by ID
export const getInterviewById = async (req, res) => {
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
        message: 'Interview ID is required' 
      });
    }
    
    console.log(`Fetching interview ${id} for company: ${companyCode}`);
    
    // Get company-specific Interview model
    const CompanyInterview = await getModelForCompany(companyCode, 'Interview', interviewSchema);
    
    // Get interview from company database
    const interview = await CompanyInterview.findById(id);
    
    if (!interview) {
      return res.status(404).json({ 
        error: 'Interview not found',
        message: `No interview found with ID: ${id}`
      });
    }
    
    res.json(interview);
  } catch (error) {
    console.error(`Error fetching interview ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided interview ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error fetching interview', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
