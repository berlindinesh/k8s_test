// import express from 'express';
// import Holiday from '../models/Holiday.js';
// const router = express.Router();


// // Get all holidays
// router.get('/', async (req, res) => {
//     try {
//         const holidays = await Holiday.find();
//         res.status(200).json(holidays);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching holidays', error });
//     }
// });

// // Create a new holiday
// router.post('/', async (req, res) => {
//     const { name, startDate, endDate, recurring } = req.body;
//     try {
//         const holiday = new Holiday({ name, startDate, endDate, recurring });
//         await holiday.save();
//         res.status(201).json(holiday);
//     } catch (error) {
//         res.status(500).json({ message: 'Error creating holiday', error });
//     }
// });

// // Update a holiday by ID
// router.put('/:id', async (req, res) => {
//     const { name, startDate, endDate, recurring } = req.body;
//     try {
//         const holiday = await Holiday.findByIdAndUpdate(req.params.id, { name, startDate, endDate, recurring }, { new: true });
//         res.status(200).json(holiday);
//     } catch (error) {
//         res.status(500).json({ message: 'Error updating holiday', error });
//     }
// });

// // Delete a holiday by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         await Holiday.findByIdAndDelete(req.params.id);
//         res.status(200).json({ message: 'Holiday deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error deleting holiday', error });
//     }
// });

// // Filter holidays by date range and recurring status
// router.get('/filter', async (req, res) => {
//     const { fromDate, toDate, recurring } = req.query;
//     const filter = {};

//     if (fromDate && toDate) {
//         filter.startDate = { $gte: new Date(fromDate) };
//         filter.endDate = { $lte: new Date(toDate) };
//     }

//     if (recurring !== undefined) {
//         filter.recurring = recurring === 'true';
//     }

//     try {
//         const holidays = await Holiday.find(filter);
//         res.status(200).json(holidays);
//     } catch (error) {
//         res.status(500).json({ message: 'Error filtering holidays', error });
//     }
// });

// export default router;

import express from 'express';
import Holiday, { holidaySchema } from '../models/Holiday.js';
import { authenticate } from '../middleware/companyAuth.js';
import getModelForCompany from '../models/genericModelFactory.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all holidays
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
        
        console.log(`Fetching holidays for company: ${companyCode}`);
        
        // Get company-specific Holiday model
        const CompanyHoliday = await getModelForCompany(companyCode, 'Holiday', holidaySchema);
        
        const holidays = await CompanyHoliday.find();
        res.status(200).json(holidays);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        res.status(500).json({ 
            message: 'Error fetching holidays', 
            error: error.message 
        });
    }
});

// Create a new holiday
router.post('/', async (req, res) => {
    const { name, startDate, endDate, recurring } = req.body;
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Creating holiday for company: ${companyCode}`);
        
        // Get company-specific Holiday model
        const CompanyHoliday = await getModelForCompany(companyCode, 'Holiday', holidaySchema);
        
        const holiday = new CompanyHoliday({ name, startDate, endDate, recurring });
        await holiday.save();
        res.status(201).json(holiday);
    } catch (error) {
        console.error('Error creating holiday:', error);
        res.status(500).json({ 
            message: 'Error creating holiday', 
            error: error.message 
        });
    }
});

// Update a holiday by ID
router.put('/:id', async (req, res) => {
    const { name, startDate, endDate, recurring } = req.body;
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Updating holiday ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific Holiday model
        const CompanyHoliday = await getModelForCompany(companyCode, 'Holiday', holidaySchema);
        
        const holiday = await CompanyHoliday.findByIdAndUpdate(
            req.params.id, 
            { name, startDate, endDate, recurring }, 
            { new: true }
        );
        
        if (!holiday) {
            return res.status(404).json({ 
                error: 'Holiday not found',
                message: `No holiday found with ID: ${req.params.id}`
            });
        }
        
        res.status(200).json(holiday);
    } catch (error) {
        console.error(`Error updating holiday ${req.params.id}:`, error);
        res.status(500).json({ 
            message: 'Error updating holiday', 
            error: error.message 
        });
    }
});

// Delete a holiday by ID
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
        
        console.log(`Deleting holiday ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific Holiday model
        const CompanyHoliday = await getModelForCompany(companyCode, 'Holiday', holidaySchema);
        
        const holiday = await CompanyHoliday.findByIdAndDelete(req.params.id);
        
        if (!holiday) {
            return res.status(404).json({ 
                error: 'Holiday not found',
                message: `No holiday found with ID: ${req.params.id}`
            });
        }
        
        res.status(200).json({ message: 'Holiday deleted successfully' });
    } catch (error) {
        console.error(`Error deleting holiday ${req.params.id}:`, error);
        res.status(500).json({ 
            message: 'Error deleting holiday', 
            error: error.message 
        });
    }
});

// Filter holidays by date range and recurring status
router.get('/filter', async (req, res) => {
    const { fromDate, toDate, recurring } = req.query;
    const filter = {};

    if (fromDate && toDate) {
        filter.startDate = { $gte: new Date(fromDate) };
        filter.endDate = { $lte: new Date(toDate) };
    }

    if (recurring !== undefined) {
        filter.recurring = recurring === 'true';
    }

    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Filtering holidays for company: ${companyCode}`);
        
        // Get company-specific Holiday model
        const CompanyHoliday = await getModelForCompany(companyCode, 'Holiday', holidaySchema);
        
        const holidays = await CompanyHoliday.find(filter);
        res.status(200).json(holidays);
    } catch (error) {
        console.error('Error filtering holidays:', error);
        res.status(500).json({ 
            message: 'Error filtering holidays', 
            error: error.message 
        });
    }
});

export default router;
