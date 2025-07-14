import Objective, { objectiveSchema } from '../models/objective.js';
import getModelForCompany from '../models/genericModelFactory.js';

export const getObjectives = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching objectives for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    const { searchTerm, objectiveType, archived, userId } = req.query;
    const filter = {};

    if (searchTerm) {
      filter.title = { $regex: searchTerm, $options: 'i' };
    }

    if (objectiveType) {
      filter.objectiveType = objectiveType;
    }

    if (archived !== undefined) {
      filter.archived = archived === 'true';
    }
    
    // If userId is provided, handle filtering based on objectiveType
    if (userId) {
      if (objectiveType === "self") {
        // For self tab: only show self objectives of the current user
        filter.userId = userId;
        filter.objectiveType = "self";
      } else {
        // For all tab: show all team objectives and only the current user's self objectives
        filter.$or = [
          { objectiveType: "all" },
          { objectiveType: "self", userId: userId }
        ];
      }
    }

    const objectives = await CompanyObjective.find(filter);
    res.status(200).json(objectives);
  } catch (error) {
    console.error('Error fetching objectives:', error);
    res.status(500).json({ 
      error: 'Error fetching objectives', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const createObjective = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating objective for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Validate required fields
    const { title, duration, description, objectiveType } = req.body;
    if (!title || !duration || !description || !objectiveType) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Missing required fields: title, duration, description, and objectiveType are required'
      });
    }
    
    // Create new objective in company database
    const objective = new CompanyObjective(req.body);
    const savedObjective = await objective.save();
    
    console.log(`Objective created successfully: ${savedObjective.title}`);
    res.status(201).json(savedObjective);
  } catch (error) {
    console.error('Error creating objective:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(400).json({ 
      error: 'Error creating objective', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const updateObjective = async (req, res) => {
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
        message: 'Objective ID is required' 
      });
    }
    
    console.log(`Updating objective ${id} for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Update objective in company database with validation
    const updatedObjective = await CompanyObjective.findByIdAndUpdate(
      id,
      req.body,
      { 
        new: true,
        runValidators: true // This ensures validation runs on update
      }
    );
    
    if (!updatedObjective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${id}`
      });
    }
    
    console.log(`Objective ${id} updated successfully`);
    res.status(200).json(updatedObjective);
  } catch (error) {
    console.error(`Error updating objective ${req.params.id}:`, error);
    
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
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error updating objective', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const deleteObjective = async (req, res) => {
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
        message: 'Objective ID is required' 
      });
    }
    
    console.log(`Deleting objective ${id} for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Delete objective from company database
    const deletedObjective = await CompanyObjective.findByIdAndDelete(id);
    
    if (!deletedObjective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${id}`
      });
    }
    
    console.log(`Objective ${id} deleted successfully`);
    res.status(200).json({ message: 'Objective deleted successfully' });
  } catch (error) {
    console.error(`Error deleting objective ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error deleting objective', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const toggleArchive = async (req, res) => {
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
        message: 'Objective ID is required' 
      });
    }
    
    console.log(`Toggling archive status for objective ${id} for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Find the objective
    const objective = await CompanyObjective.findById(id);
    
    if (!objective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${id}`
      });
    }
    
    // Toggle the archived status
    objective.archived = !objective.archived;
    const updatedObjective = await objective.save();
    
    console.log(`Objective ${id} archive status toggled to ${updatedObjective.archived}`);
    res.status(200).json(updatedObjective);
  } catch (error) {
    console.error(`Error toggling archive for objective ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error toggling archive status', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Continuing the getObjectivesByUser function
export const getObjectivesByUser = async (req, res) => {
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
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log(`Fetching objectives for user ${userId} in company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Find objectives for this user
    const objectives = await CompanyObjective.find({ userId });
    
    res.status(200).json(objectives);
  } catch (error) {
    console.error(`Error fetching objectives for user ${req.params.userId}:`, error);
    
    res.status(500).json({ 
      error: 'Error fetching objectives by user', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add this function to calculate objective progress
export const calculateObjectiveProgress = async (req, res) => {
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
        message: 'Objective ID is required' 
      });
    }
    
    console.log(`Calculating progress for objective ${id} for company: ${companyCode}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Find the objective
    const objective = await CompanyObjective.findById(id);
    
    if (!objective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${id}`
      });
    }
    
    // Calculate progress based on key results
    let progress = 0;
    
    if (objective.keyResultsData && objective.keyResultsData.length > 0) {
      // Calculate progress based on completed key results
      const completedKeyResults = objective.keyResultsData.filter(kr => kr.completed).length;
      progress = Math.round((completedKeyResults / objective.keyResultsData.length) * 100);
    }
    
    // Update the objective with the calculated progress
    objective.progress = progress;
    await objective.save();
    
    res.status(200).json({ progress });
  } catch (error) {
    console.error(`Error calculating progress for objective ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error calculating progress', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add this function to update key result completion status
export const updateKeyResultStatus = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { objectiveId, keyResultIndex } = req.params;
    const { completed } = req.body;
    
    if (!objectiveId || keyResultIndex === undefined) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Objective ID and key result index are required' 
      });
    }
    
    console.log(`Updating key result status for objective ${objectiveId}, index ${keyResultIndex}`);
    
    // Get company-specific Objective model
    const CompanyObjective = await getModelForCompany(companyCode, 'Objective', objectiveSchema);
    
    // Find the objective
    const objective = await CompanyObjective.findById(objectiveId);
    
    if (!objective) {
      return res.status(404).json({ 
        error: 'Objective not found',
        message: `No objective found with ID: ${objectiveId}`
      });
    }
    
    // Check if the key result exists
    if (!objective.keyResultsData || !objective.keyResultsData[keyResultIndex]) {
      return res.status(404).json({ 
        error: 'Key result not found',
        message: `No key result found at index ${keyResultIndex}`
      });
    }
    
    // Update the key result completion status
    objective.keyResultsData[keyResultIndex].completed = completed;
    
    // Calculate new progress
    const completedKeyResults = objective.keyResultsData.filter(kr => kr.completed).length;
    const progress = Math.round((completedKeyResults / objective.keyResultsData.length) * 100);
    
    // Update the objective progress
    objective.progress = progress;
    
    // Save the updated objective
    const updatedObjective = await objective.save();
    
    res.status(200).json(updatedObjective);
  } catch (error) {
    console.error(`Error updating key result status:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided objective ID is not valid'
      });
    }
    
    res.status(400).json({ 
      error: 'Error updating key result status', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};



