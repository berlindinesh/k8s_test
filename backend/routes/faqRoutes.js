// import express from 'express';
// import Faq from '../models/Faq.js';
// import FaqCategory from '../models/FaqCategory.js';

// const router = express.Router();

// // Get FAQs by category
// router.get('/category/:categoryId', async (req, res) => {
//     try {
//         const faqs = await Faq.find({ category: req.params.categoryId });
//         res.json(faqs);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Add a new FAQ to a category
// router.post('/category/:categoryId', async (req, res) => {
//     try {
//         const newFaq = new Faq({
//             category: req.params.categoryId,
//             question: req.body.question,
//             answer: req.body.answer
//         });
//         const savedFaq = await newFaq.save();
//         res.status(201).json(savedFaq);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update an FAQ
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedFaq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         res.json(updatedFaq);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Delete an FAQ
// router.delete('/:id', async (req, res) => {
//     try {
//         await Faq.findByIdAndDelete(req.params.id);
//         res.json({ message: 'FAQ deleted' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });




// export default router;

import express from 'express';
import Faq, { FaqSchema } from '../models/Faq.js';
import FaqCategory from '../models/FaqCategory.js';
import { authenticate } from '../middleware/companyAuth.js';
import getModelForCompany from '../models/genericModelFactory.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get FAQs by category
router.get('/category/:categoryId', async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Fetching FAQs for category ${req.params.categoryId} for company: ${companyCode}`);
        
        // Get company-specific Faq model
        const CompanyFaq = await getModelForCompany(companyCode, 'Faq', FaqSchema);
        
        const faqs = await CompanyFaq.find({ category: req.params.categoryId });
        res.json(faqs);
    } catch (err) {
        console.error(`Error fetching FAQs for category ${req.params.categoryId}:`, err);
        res.status(500).json({ 
            error: err.message,
            message: 'Error fetching FAQs'
        });
    }
});

// Add a new FAQ to a category
router.post('/category/:categoryId', async (req, res) => {
    try {
        // Get company code from authenticated user
        const companyCode = req.companyCode;
        
        if (!companyCode) {
            return res.status(401).json({ 
                error: 'Authentication required', 
                message: 'Company code not found in request' 
            });
        }
        
        console.log(`Creating FAQ for category ${req.params.categoryId} for company: ${companyCode}`);
        
        // Get company-specific Faq model
        const CompanyFaq = await getModelForCompany(companyCode, 'Faq', FaqSchema);
        
        const newFaq = new CompanyFaq({
            category: req.params.categoryId,
            question: req.body.question,
            answer: req.body.answer
        });
        const savedFaq = await newFaq.save();
        res.status(201).json(savedFaq);
    } catch (err) {
        console.error(`Error creating FAQ for category ${req.params.categoryId}:`, err);
        res.status(500).json({ 
            error: err.message,
            message: 'Error creating FAQ'
        });
    }
});

// Update an FAQ
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
        
        console.log(`Updating FAQ ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific Faq model
        const CompanyFaq = await getModelForCompany(companyCode, 'Faq', FaqSchema);
        
        const updatedFaq = await CompanyFaq.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedFaq) {
            return res.status(404).json({ 
                error: 'FAQ not found',
                message: `No FAQ found with ID: ${req.params.id}`
            });
        }
        
        res.json(updatedFaq);
    } catch (err) {
        console.error(`Error updating FAQ ${req.params.id}:`, err);
        res.status(500).json({ 
            error: err.message,
            message: 'Error updating FAQ'
        });
    }
});

// Delete an FAQ
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
        
        console.log(`Deleting FAQ ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific Faq model
        const CompanyFaq = await getModelForCompany(companyCode, 'Faq', FaqSchema);
        
        const deletedFaq = await CompanyFaq.findByIdAndDelete(req.params.id);
        
        if (!deletedFaq) {
            return res.status(404).json({ 
                error: 'FAQ not found',
                message: `No FAQ found with ID: ${req.params.id}`
            });
        }
        
        res.json({ message: 'FAQ deleted' });
    } catch (err) {
        console.error(`Error deleting FAQ ${req.params.id}:`, err);
        res.status(500).json({ 
            error: err.message,
            message: 'Error deleting FAQ'
        });
    }
});

export default router;
