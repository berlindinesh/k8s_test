import HiredEmployee, { hiredEmployeeSchema } from '../models/HiredEmployee.js';
import getModelForCompany from '../models/genericModelFactory.js';

export const getAllHiredEmployees = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching hired employees for company: ${companyCode}`);
        
        // Get company-specific HiredEmployee model
        const CompanyHiredEmployee = await getModelForCompany(companyCode, 'HiredEmployee', hiredEmployeeSchema);
        
        // Get hired employees from company database
        const hiredEmployees = await CompanyHiredEmployee.find().sort({ createdAt: -1 });
        
        console.log(`Retrieved ${hiredEmployees.length} hired employees for company ${companyCode}`);
        res.status(200).json(hiredEmployees);
    } catch (error) {
        console.error(`Error fetching hired employees:`, error);
        res.status(500).json({ 
            message: 'Error fetching hired employees', 
            error: error.message 
        });
    }
};

export const createHiredEmployee = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Creating hired employee for company: ${companyCode}`);
        
        // Get company-specific HiredEmployee model
        const CompanyHiredEmployee = await getModelForCompany(companyCode, 'HiredEmployee', hiredEmployeeSchema);
        
        // Create new hired employee in company database
        const newHiredEmployee = new CompanyHiredEmployee(req.body);
        const savedHiredEmployee = await newHiredEmployee.save();
        
        console.log(`Hired employee created successfully for ${req.body.name}`);
        res.status(201).json(savedHiredEmployee);
    } catch (error) {
        console.error('Error creating hired employee:', error);
        
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
                message: 'An employee with this email already exists'
            });
        }
        
        res.status(400).json({ 
            message: 'Error creating hired employee', 
            error: error.message 
        });
    }
};

export const updateHiredEmployee = async (req, res) => {
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
                message: 'Employee ID is required' 
            });
        }
        
        console.log(`Updating hired employee ${id} for company: ${companyCode}`);
        
        // Get company-specific HiredEmployee model
        const CompanyHiredEmployee = await getModelForCompany(companyCode, 'HiredEmployee', hiredEmployeeSchema);
        
        // Update hired employee in company database with validation
        const updatedHiredEmployee = await CompanyHiredEmployee.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!updatedHiredEmployee) {
            return res.status(404).json({ 
                error: 'Hired employee not found',
                message: `No hired employee found with ID: ${id}`
            });
        }
        
        console.log(`Hired employee ${id} updated successfully`);
        res.status(200).json(updatedHiredEmployee);
    } catch (error) {
        console.error(`Error updating hired employee ${req.params.id}:`, error);
        
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
                message: 'The provided employee ID is not valid'
            });
        }
        
        res.status(400).json({ 
            message: 'Error updating hired employee', 
            error: error.message 
        });
    }
};

export const deleteHiredEmployee = async (req, res) => {
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
                message: 'Employee ID is required' 
            });
        }
        
        console.log(`Deleting hired employee ${id} for company: ${companyCode}`);
        
        // Get company-specific HiredEmployee model
        const CompanyHiredEmployee = await getModelForCompany(companyCode, 'HiredEmployee', hiredEmployeeSchema);
        
        // Delete hired employee from company database
        const deletedHiredEmployee = await CompanyHiredEmployee.findByIdAndDelete(id);
        
        if (!deletedHiredEmployee) {
            return res.status(404).json({ 
                error: 'Hired employee not found',
                message: `No hired employee found with ID: ${id}`
            });
        }
        
        console.log(`Hired employee ${id} deleted successfully`);
        res.status(200).json({ 
            message: 'Hired employee deleted successfully' 
        });
    } catch (error) {
        console.error(`Error deleting hired employee ${req.params.id}:`, error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided employee ID is not valid'
            });
        }
        
        res.status(500).json({ 
            message: 'Error deleting hired employee', 
            error: error.message 
        });
    }
};

export const getHiredEmployeeById = async (req, res) => {
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
                message: 'Employee ID is required' 
            });
        }
        
        console.log(`Fetching hired employee ${id} for company: ${companyCode}`);
        
        // Get company-specific HiredEmployee model
        const CompanyHiredEmployee = await getModelForCompany(companyCode, 'HiredEmployee', hiredEmployeeSchema);
        
        // Get hired employee from company database
        const hiredEmployee = await CompanyHiredEmployee.findById(id);
        
        if (!hiredEmployee) {
            return res.status(404).json({ 
                error: 'Hired employee not found',
                message: `No hired employee found with ID: ${id}`
            });
        }
        
        res.status(200).json(hiredEmployee);
    } catch (error) {
        console.error(`Error fetching hired employee ${req.params.id}:`, error);
        
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({
                error: 'Invalid ID',
                message: 'The provided employee ID is not valid'
            });
        }
        
        res.status(500).json({ 
            message: 'Error fetching hired employee', 
            error: error.message 
        });
    }
};

export const filterHiredEmployees = async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Filtering hired employees for company: ${companyCode}`);
        
        // Get company-specific HiredEmployee model
        const CompanyHiredEmployee = await getModelForCompany(companyCode, 'HiredEmployee', hiredEmployeeSchema);
        
        const { department, status, search } = req.query;
        let query = {};

        if (department && department !== 'All') {
            query.department = department;
        }
        if (status && status !== 'All') {
            query.status = status;
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { jobPosition: { $regex: search, $options: 'i' } }
            ];
        }

        console.log(`Filter query:`, query);
        
        // Get filtered hired employees from company database
        const hiredEmployees = await CompanyHiredEmployee.find(query).sort({ createdAt: -1 });
        
        console.log(`Retrieved ${hiredEmployees.length} filtered hired employees for company ${companyCode}`);
        res.status(200).json(hiredEmployees);
    } catch (error) {
        console.error('Error filtering hired employees:', error);
        res.status(500).json({ 
            message: 'Error filtering hired employees', 
            error: error.message 
        });
    }
};
