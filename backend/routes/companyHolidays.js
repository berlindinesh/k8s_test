// import express from 'express';
// import mongoose from 'mongoose';
// import CompanyHoliday from '../models/CompanyHolidays.js';
// const router = express.Router();

// // Middleware to validate holiday data
// const validateHoliday = (req, res, next) => {
//     const { week, day } = req.body;
//     if (!week || !day) {
//         return res.status(400).json({ message: 'Week and day are required fields' });
//     }
//     next();
// };

// // GET all company holidays
// router.get('/', async (req, res) => {
//     try {
//         const companyHolidays = await CompanyHoliday.find();
//         res.json(companyHolidays);
//     } catch (err) {
//         console.error('Error fetching company holidays:', err.message);
//         res.status(500).json({ message: 'Error fetching company holidays' });
//     }
// });

// // POST a new company holiday
// router.post('/', validateHoliday, async (req, res) => {
//     const { week, day } = req.body;
//     const companyHoliday = new CompanyHoliday({ week, day });

//     try {
//         const savedHoliday = await companyHoliday.save();
//         res.status(201).json(savedHoliday);
//     } catch (err) {
//         console.error('Error creating company holiday:', err.message);
//         res.status(500).json({ message: 'Error creating company holiday' });
//     }
// });

// // PUT (update) an existing company holiday by ID
// router.put('/:id', validateHoliday, async (req, res) => {
//     const { id } = req.params;  // Route parameter (ID)
//     const { week, day } = req.body;

//     // Ensure the ID is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'Invalid holiday ID format' });
//     }

//     try {
//         const updatedHoliday = await CompanyHoliday.findByIdAndUpdate(id, { week, day }, { new: true });
//         if (!updatedHoliday) return res.status(404).json({ message: 'Holiday not found' });
//         res.json(updatedHoliday);
//     } catch (err) {
//         console.error(`Error updating company holiday with ID ${id}:`, err.message);
//         res.status(500).json({ message: 'Error updating company holiday' });
//     }
// });

// // DELETE a company holiday by ID
// router.delete('/:id', async (req, res) => {
//     const { id } = req.params;  // Route parameter (ID)

//     // Ensure the ID is a valid MongoDB ObjectId
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(400).json({ message: 'Invalid holiday ID format' });
//     }

//     try {
//         const deletedHoliday = await CompanyHoliday.findByIdAndDelete(id);
//         if (!deletedHoliday) return res.status(404).json({ message: 'Holiday not found' });
//         res.json({ message: 'Holiday deleted successfully' });
//     } catch (err) {
//         console.error(`Error deleting company holiday with ID ${id}:`, err.message);
//         res.status(500).json({ message: 'Error deleting company holiday' });
//     }
// });

// export default router;

import express from 'express';
import mongoose from 'mongoose';
import CompanyHoliday, { companyHolidaySchema } from '../models/CompanyHolidays.js';
import { authenticate } from '../middleware/companyAuth.js';
import getModelForCompany from '../models/genericModelFactory.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Middleware to validate holiday data
const validateHoliday = (req, res, next) => {
    const { week, day } = req.body;
    if (!week || !day) {
        return res.status(400).json({ message: 'Week and day are required fields' });
    }
    next();
};

// GET all company holidays
router.get('/', async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching company holidays for company: ${companyCode}`);
        
        // Get company-specific CompanyHoliday model
        const CompanyHolidayModel = await getModelForCompany(companyCode, 'CompanyHoliday', companyHolidaySchema);
        
        const companyHolidays = await CompanyHolidayModel.find();
        res.json(companyHolidays);
    } catch (err) {
        console.error('Error fetching company holidays:', err.message);
        res.status(500).json({ message: 'Error fetching company holidays' });
    }
});

// POST a new company holiday
router.post('/', validateHoliday, async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Creating company holiday for company: ${companyCode}`);
        
        // Get company-specific CompanyHoliday model
        const CompanyHolidayModel = await getModelForCompany(companyCode, 'CompanyHoliday', companyHolidaySchema);
        
        const { week, day } = req.body;
        const companyHoliday = new CompanyHolidayModel({ week, day });
        
        const savedHoliday = await companyHoliday.save();
        res.status(201).json(savedHoliday);
    } catch (err) {
        console.error('Error creating company holiday:', err.message);
        res.status(500).json({ message: 'Error creating company holiday' });
    }
});

// PUT (update) an existing company holiday by ID
router.put('/:id', validateHoliday, async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;  // Route parameter (ID)
        
        // Ensure the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid holiday ID format' });
        }
        
        console.log(`Updating company holiday ${id} for company: ${companyCode}`);
        
        // Get company-specific CompanyHoliday model
        const CompanyHolidayModel = await getModelForCompany(companyCode, 'CompanyHoliday', companyHolidaySchema);
        
        const { week, day } = req.body;
        
        const updatedHoliday = await CompanyHolidayModel.findByIdAndUpdate(
            id, 
            { week, day }, 
            { new: true }
        );
        
        if (!updatedHoliday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        
        res.json(updatedHoliday);
    } catch (err) {
        console.error(`Error updating company holiday with ID ${req.params.id}:`, err.message);
        res.status(500).json({ message: 'Error updating company holiday' });
    }
});

// DELETE a company holiday by ID
router.delete('/:id', async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        const { id } = req.params;  // Route parameter (ID)
        
        // Ensure the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid holiday ID format' });
        }
        
        console.log(`Deleting company holiday ${id} for company: ${companyCode}`);
        
        // Get company-specific CompanyHoliday model
        const CompanyHolidayModel = await getModelForCompany(companyCode, 'CompanyHoliday', companyHolidaySchema);
        
        const deletedHoliday = await CompanyHolidayModel.findByIdAndDelete(id);
        
        if (!deletedHoliday) {
            return res.status(404).json({ message: 'Holiday not found' });
        }
        
        res.json({ message: 'Holiday deleted successfully' });
    } catch (err) {
        console.error(`Error deleting company holiday with ID ${req.params.id}:`, err.message);
        res.status(500).json({ message: 'Error deleting company holiday' });
    }
});

export default router;
