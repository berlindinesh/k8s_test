// // candidateController.js
// import Candidate from '../models/candidate.js';

// // Add new candidate
// export const addCandidate = async (req, res) => {
//   try {
//     const newCandidate = new Candidate(req.body);
//     await newCandidate.save();
//     res.status(201).json(newCandidate);
//   } catch (error) {
//     console.error('Error adding candidate:', error);
//     res.status(500).json({ message: 'Error adding candidate' });
//   }
// };

// // Get candidates by recruitment
// export const getCandidatesByRecruitment = async (req, res) => {
//   try {
//     const candidates = await Candidate.find({ recruitment: req.params.recruitment });
//     res.status(200).json(candidates);
//   } catch (error) {
//     console.error('Error fetching candidates:', error);
//     res.status(500).json({ message: 'Error fetching candidates' });
//   }
// };

// // Edit candidate
// export const updateCandidate = async (req, res) => {
//   try {
//     const updatedCandidate = await Candidate.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!updatedCandidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
//     res.status(200).json(updatedCandidate);
//   } catch (error) {
//     console.error('Error updating candidate:', error);
//     res.status(500).json({ message: 'Error updating candidate' });
//   }
// };

// // Delete candidate
// export const deleteCandidate = async (req, res) => {
//   try {
//     const deletedCandidate = await Candidate.findByIdAndDelete(req.params.id);
//     if (!deletedCandidate) {
//       return res.status(404).json({ message: 'Candidate not found' });
//     }
//     res.status(200).json({ message: 'Candidate deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting candidate:', error);
//     res.status(500).json({ message: 'Error deleting candidate' });
//   }
// };


import Candidate, { candidateSchema } from '../models/candidate.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Add new candidate
export const addCandidate = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating candidate for company: ${companyCode}`);
    
    // Get company-specific Candidate model
    const CompanyCandidate = await getModelForCompany(companyCode, 'Candidate', candidateSchema);
    
    // Validate required fields
    const { name, email, department, column, stars, recruitment } = req.body;
    if (!name || !email || !department || !column || stars === undefined || !recruitment) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: name, email, department, column, stars, and recruitment are required'
      });
    }
    
    // Create new candidate in company database
    const candidate = new CompanyCandidate(req.body);
    await candidate.save();
    
    console.log(`Candidate created successfully: ${req.body.name}`);
    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error creating candidate:', error);
    
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

// Get candidates by recruitment
export const getCandidatesByRecruitment = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching candidates for company: ${companyCode}, recruitment: ${req.params.recruitment}`);
    
    // Get company-specific Candidate model
    const CompanyCandidate = await getModelForCompany(companyCode, 'Candidate', candidateSchema);
    
    // Get candidates from company database
    const candidates = await CompanyCandidate.find({ recruitment: req.params.recruitment });
    
    console.log(`Retrieved ${candidates.length} candidates for company ${companyCode}`);
    res.status(200).json(candidates);
  } catch (error) {
    console.error(`Error fetching candidates for company ${req.companyCode}:`, error);
    res.status(500).json({ 
      error: 'Error fetching candidates', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Edit candidate
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
    
    console.log(`Updating candidate ${id} for company: ${companyCode}`);
    
    // Get company-specific Candidate model
    const CompanyCandidate = await getModelForCompany(companyCode, 'Candidate', candidateSchema);
    
    // Validate required fields
    const { name, email, department, column, stars, recruitment } = req.body;
    if (!name || !email || !department || !column || stars === undefined || !recruitment) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: name, email, department, column, stars, and recruitment are required'
      });
    }
    
    // Update candidate in company database with validation
    const candidate = await CompanyCandidate.findByIdAndUpdate(
      id, 
      req.body, 
      { 
        new: true,
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!candidate) {
      return res.status(404).json({ 
        error: 'Candidate not found',
        message: `No candidate found with ID: ${id}`
      });
    }
    
    console.log(`Candidate ${id} updated successfully`);
    res.status(200).json(candidate);
  } catch (error) {
    console.error(`Error updating candidate ${req.params.id}:`, error);
    
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
    
    console.log(`Deleting candidate ${id} for company: ${companyCode}`);
    
    // Get company-specific Candidate model
    const CompanyCandidate = await getModelForCompany(companyCode, 'Candidate', candidateSchema);
    
    // Delete candidate from company database
    const candidate = await CompanyCandidate.findByIdAndDelete(id);
    
    if (!candidate) {
      return res.status(404).json({ 
        error: 'Candidate not found',
        message: `No candidate found with ID: ${id}`
      });
    }
    
    console.log(`Candidate ${id} deleted successfully`);
    res.json({ 
      message: 'Candidate deleted successfully',
      deletedCandidate: {
        id: candidate._id,
        name: candidate.name,
        email: candidate.email
      }
    });
  } catch (error) {
    console.error(`Error deleting candidate ${req.params.id}:`, error);
    
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
