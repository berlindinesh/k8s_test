import Resignation, { resignationSchema } from '../models/resignation.js';
import getModelForCompany from '../models/genericModelFactory.js';
import { sendResignationEmail } from '../services/emailservice.js';

export const createResignation = async (req, res) => {
    try {
      // Get company code from authenticated user
      const companyCode = req.companyCode;
      
      if (!companyCode) {
        return res.status(401).json({ 
          error: 'Authentication required', 
          message: 'Company code not found in request' 
        });
      }
      
      console.log(`Creating resignation for company: ${companyCode}`);
      
      // Get company-specific Resignation model
      const CompanyResignation = await getModelForCompany(companyCode, 'Resignation', resignationSchema);
      
      // Ensure userId is provided
      if (!req.body.userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      
      const resignation = new CompanyResignation({
        ...req.body,
        status: 'Requested' // Ensure initial status is always 'Requested'
      });
      const savedResignation = await resignation.save();
      await sendResignationEmail(req.body);
      res.status(201).json(savedResignation);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

export const getAllResignations = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching all resignations for company: ${companyCode}`);
    
    // Get company-specific Resignation model
    const CompanyResignation = await getModelForCompany(companyCode, 'Resignation', resignationSchema);
    
    const resignations = await CompanyResignation.find().sort({ createdAt: -1 });
    res.status(200).json(resignations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getResignationsByUser = async (req, res) => {
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
      return res.status(400).json({ message: "userId is required" });
    }
    
    console.log(`Fetching resignations for userId: ${userId} in company: ${companyCode}`);
    
    // Get company-specific Resignation model
    const CompanyResignation = await getModelForCompany(companyCode, 'Resignation', resignationSchema);
    
    const resignations = await CompanyResignation.find({ userId }).sort({ createdAt: -1 });
    console.log("Found resignations:", resignations.length);
    
    res.status(200).json(resignations);
  } catch (error) {
    console.error("Error in getResignationsByUser:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateResignation = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Updating resignation for company: ${companyCode}`);
    
    // Get company-specific Resignation model
    const CompanyResignation = await getModelForCompany(companyCode, 'Resignation', resignationSchema);
    
    // First check if the resignation exists
    const resignation = await CompanyResignation.findById(req.params.id);
    
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found" });
    }
    
    const updatedResignation = await CompanyResignation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    // Send email notification if status has changed
    if (req.body.status && req.body.status !== 'Requested') {
      await sendResignationEmail({
        name: updatedResignation.name,
        email: updatedResignation.email,
        position: updatedResignation.position,
        status: updatedResignation.status,
        description: updatedResignation.description,
        reviewNotes: updatedResignation.reviewNotes
      });
    }
    
    res.status(200).json(updatedResignation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteResignation = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Deleting resignation for company: ${companyCode}`);
    
    // Get company-specific Resignation model
    const CompanyResignation = await getModelForCompany(companyCode, 'Resignation', resignationSchema);
    
    // First check if the resignation exists
    const resignation = await CompanyResignation.findById(req.params.id);
    
    if (!resignation) {
      return res.status(404).json({ message: "Resignation not found" });
    }
    
    await CompanyResignation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Resignation deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendEmail = async (req, res) => {
  try {
    await sendResignationEmail(req.body);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

