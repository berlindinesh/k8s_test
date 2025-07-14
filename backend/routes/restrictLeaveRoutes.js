// // routes/restrictLeaveRoutes.js
// import express from 'express';
// import RestrictLeave from '../models/restrictLeave.js';
// const router = express.Router();

// // GET all restricted leaves
// router.get('/', async (req, res) => {
//     try {
//         const restrictLeaves = await RestrictLeave.find();
//         res.json(restrictLeaves);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // GET a single restricted leave by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const restrictLeave = await RestrictLeave.findById(req.params.id);
//         if (!restrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
//         res.json(restrictLeave);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// // POST a new restricted leave
// router.post('/', async (req, res) => {
//     const restrictLeave = new RestrictLeave({
//         title: req.body.title,
//         startDate: req.body.startDate,
//         endDate: req.body.endDate,
//         department: req.body.department,
//         jobPosition: req.body.jobPosition,
//         description: req.body.description
//     });

//     try {
//         const newRestrictLeave = await restrictLeave.save();
//         res.status(201).json(newRestrictLeave);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // PUT to update an existing restricted leave by ID
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedRestrictLeave = await RestrictLeave.findByIdAndUpdate(
//             req.params.id,
//             {
//                 title: req.body.title,
//                 startDate: req.body.startDate,
//                 endDate: req.body.endDate,
//                 department: req.body.department,
//                 jobPosition: req.body.jobPosition,
//                 description: req.body.description
//             },
//             { new: true, runValidators: true }
//         );
//         if (!updatedRestrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
//         res.json(updatedRestrictLeave);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

// // DELETE a restricted leave by ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const deletedRestrictLeave = await RestrictLeave.findByIdAndDelete(req.params.id);
//         if (!deletedRestrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
//         res.json({ message: 'Restricted leave deleted' });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// export default router;

// routes/restrictLeaveRoutes.js
import express from 'express';
import RestrictLeave, { restrictLeaveSchema } from '../models/restrictLeave.js';
import { authenticate } from '../middleware/companyAuth.js';
import getModelForCompany from '../models/genericModelFactory.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET all restricted leaves
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
        
        console.log(`Fetching restricted leaves for company: ${companyCode}`);
        
        // Get company-specific RestrictLeave model
        const CompanyRestrictLeave = await getModelForCompany(companyCode, 'RestrictLeave', restrictLeaveSchema);
        
        const restrictLeaves = await CompanyRestrictLeave.find();
        res.json(restrictLeaves);
    } catch (err) {
        console.error('Error fetching restricted leaves:', err);
        res.status(500).json({ message: err.message });
    }
});

// GET a single restricted leave by ID
router.get('/:id', async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching restricted leave ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific RestrictLeave model
        const CompanyRestrictLeave = await getModelForCompany(companyCode, 'RestrictLeave', restrictLeaveSchema);
        
        const restrictLeave = await CompanyRestrictLeave.findById(req.params.id);
        if (!restrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
        res.json(restrictLeave);
    } catch (err) {
        console.error(`Error fetching restricted leave ${req.params.id}:`, err);
        res.status(500).json({ message: err.message });
    }
});

// POST a new restricted leave
router.post('/', async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Creating restricted leave for company: ${companyCode}`);
        
        // Get company-specific RestrictLeave model
        const CompanyRestrictLeave = await getModelForCompany(companyCode, 'RestrictLeave', restrictLeaveSchema);
        
        const restrictLeave = new CompanyRestrictLeave({
            title: req.body.title,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            department: req.body.department,
            jobPosition: req.body.jobPosition,
            description: req.body.description
        });

        const newRestrictLeave = await restrictLeave.save();
        res.status(201).json(newRestrictLeave);
    } catch (err) {
        console.error('Error creating restricted leave:', err);
        res.status(400).json({ message: err.message });
    }
});

// PUT to update an existing restricted leave by ID
router.put('/:id', async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Updating restricted leave ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific RestrictLeave model
        const CompanyRestrictLeave = await getModelForCompany(companyCode, 'RestrictLeave', restrictLeaveSchema);
        
        const updatedRestrictLeave = await CompanyRestrictLeave.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                department: req.body.department,
                jobPosition: req.body.jobPosition,
                description: req.body.description
            },
            { new: true, runValidators: true }
        );
        if (!updatedRestrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
        res.json(updatedRestrictLeave);
    } catch (err) {
        console.error(`Error updating restricted leave ${req.params.id}:`, err);
        res.status(400).json({ message: err.message });
    }
});

// DELETE a restricted leave by ID
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
        
        console.log(`Deleting restricted leave ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific RestrictLeave model
        const CompanyRestrictLeave = await getModelForCompany(companyCode, 'RestrictLeave', restrictLeaveSchema);
        
        const deletedRestrictLeave = await CompanyRestrictLeave.findByIdAndDelete(req.params.id);
        if (!deletedRestrictLeave) return res.status(404).json({ message: 'Restricted leave not found' });
        res.json({ message: 'Restricted leave deleted' });
    } catch (err) {
        console.error(`Error deleting restricted leave ${req.params.id}:`, err);
        res.status(500).json({ message: err.message });
    }
});

export default router;
