// import express from 'express';
// const router = express.Router();
// import FaqCategory from '../models/FaqCategory.js';
// import Faq from '../models/Faq.js';



// // Get all FAQ categories with counts
// router.get('/', async (req, res) => {
//     try {
//         const categories = await FaqCategory.find();
        
//         // Get counts for each category
//         const categoriesWithCounts = await Promise.all(
//             categories.map(async (category) => {
//                 const count = await Faq.countDocuments({ category: category._id });
//                 return {
//                     ...category.toObject(),
//                     faqCount: count
//                 };
//             })
//         );
        
//         res.json(categoriesWithCounts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// // Get FAQ category by ID


// router.get('/:id', async (req, res) => {
//     try {
//         const category = await FaqCategory.findById(req.params.id);
//         if (!category) {
//             return res.status(404).json({ message: 'Category not found' });
//         }
        
//         // Get count for this category
//         const count = await Faq.countDocuments({ category: category._id });
//         const categoryWithCount = {
//             ...category.toObject(),
//             faqCount: count
//         };
        
//         res.json(categoryWithCount);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// router.get('/:id', async (req, res) => {
//     try {
//         const category = await FaqCategory.findById(req.params.id);
//         if (!category) {
//             return res.status(404).json({ message: 'Category not found' });
//         }
        
//         // Get count for this category
//         const count = await Faq.countDocuments({ category: category._id });
//         const categoryWithCount = {
//             ...category.toObject(),
//             faqCount: count
//         };
        
//         res.json(categoryWithCount);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });



// // Create new FAQ category
// router.post('/', async (req, res) => {
//     const category = new FaqCategory({
//         title: req.body.title,
//         description: req.body.description
//     });

//     try {
//         const newCategory = await category.save();
//         res.status(201).json(newCategory);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });



// // // Update FAQ category
// router.put('/:id', async (req, res) => {
//     try {
//         const updatedCategory = await FaqCategory.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true }
//         );
//         res.json(updatedCategory);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });

// // // Delete FAQ category
// router.delete('/:id', async (req, res) => {
//     try {
//         await FaqCategory.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Category deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// export default router;

import express from 'express';
import FaqCategory, { FaqCategorySchema } from '../models/FaqCategory.js';
import Faq, { FaqSchema } from '../models/Faq.js';
import { authenticate } from '../middleware/companyAuth.js';
import getModelForCompany from '../models/genericModelFactory.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all FAQ categories with counts
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
        
        console.log(`Fetching FAQ categories for company: ${companyCode}`);
        
        // Get company-specific models
        const CompanyFaqCategory = await getModelForCompany(companyCode, 'FaqCategory', FaqCategorySchema);
        const CompanyFaq = await getModelForCompany(companyCode, 'Faq', FaqSchema);
        
        const categories = await CompanyFaqCategory.find();
        
        // Get counts for each category
        const categoriesWithCounts = await Promise.all(
            categories.map(async (category) => {
                const count = await CompanyFaq.countDocuments({ category: category._id });
                return {
                    ...category.toObject(),
                    faqCount: count
                };
            })
        );
        
        res.json(categoriesWithCounts);
    } catch (error) {
        console.error('Error fetching FAQ categories:', error);
        res.status(500).json({ 
            message: error.message,
            error: 'Error fetching FAQ categories'
        });
    }
});

// Get FAQ category by ID
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
        
        console.log(`Fetching FAQ category ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific models
        const CompanyFaqCategory = await getModelForCompany(companyCode, 'FaqCategory', FaqCategorySchema);
        const CompanyFaq = await getModelForCompany(companyCode, 'Faq', FaqSchema);
        
        const category = await CompanyFaqCategory.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Get count for this category
        const count = await CompanyFaq.countDocuments({ category: category._id });
        const categoryWithCount = {
            ...category.toObject(),
            faqCount: count
        };
        
        res.json(categoryWithCount);
    } catch (error) {
        console.error(`Error fetching FAQ category ${req.params.id}:`, error);
        res.status(500).json({ 
            message: error.message,
            error: 'Error fetching FAQ category'
        });
    }
});

// Create new FAQ category
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
        
        console.log(`Creating FAQ category for company: ${companyCode}`);
        
        // Get company-specific FaqCategory model
        const CompanyFaqCategory = await getModelForCompany(companyCode, 'FaqCategory', FaqCategorySchema);
        
        const category = new CompanyFaqCategory({
            title: req.body.title,
            description: req.body.description
        });

        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating FAQ category:', error);
        res.status(400).json({ 
            message: error.message,
            error: 'Error creating FAQ category'
        });
    }
});

// Update FAQ category
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
        
        console.log(`Updating FAQ category ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific FaqCategory model
        const CompanyFaqCategory = await getModelForCompany(companyCode, 'FaqCategory', FaqCategorySchema);
        
        const updatedCategory = await CompanyFaqCategory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        if (!updatedCategory) {
            return res.status(404).json({ 
                message: 'Category not found',
                error: `No category found with ID: ${req.params.id}`
            });
        }
        
        res.json(updatedCategory);
    } catch (error) {
        console.error(`Error updating FAQ category ${req.params.id}:`, error);
        res.status(400).json({ 
            message: error.message,
            error: 'Error updating FAQ category'
        });
    }
});

// Delete FAQ category
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
        
        console.log(`Deleting FAQ category ${req.params.id} for company: ${companyCode}`);
        
        // Get company-specific models
        const CompanyFaqCategory = await getModelForCompany(companyCode, 'FaqCategory', FaqCategorySchema);
        const CompanyFaq = await getModelForCompany(companyCode, 'Faq', FaqSchema);
        
        // First, delete all FAQs in this category
        await CompanyFaq.deleteMany({ category: req.params.id });
        
        // Then delete the category
        const deletedCategory = await CompanyFaqCategory.findByIdAndDelete(req.params.id);
        
        if (!deletedCategory) {
            return res.status(404).json({ 
                message: 'Category not found',
                error: `No category found with ID: ${req.params.id}`
            });
        }
        
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error(`Error deleting FAQ category ${req.params.id}:`, error);
        res.status(500).json({ 
            message: error.message,
            error: 'Error deleting FAQ category'
        });
    }
});

export default router;
