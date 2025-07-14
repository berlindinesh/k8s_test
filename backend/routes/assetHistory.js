// import express from 'express';
// import Asset from '../models/AssetHistory.js';
// const router = express.Router();

// // GET all assets
// router.get('/', async (req, res) => {
//   try {
//     const assets = await Asset.find();
//     res.json(assets);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // POST create a new asset
// router.post('/', async (req, res) => {
//   // Update to include all fields from the frontend
//   const { 
//     name, 
//     category, 
//     allottedDate, 
//     returnDate, 
//     status, 
//     batch, 
//     currentEmployee,
//     previousEmployees 
//   } = req.body;
  
//   const asset = new Asset({ 
//     name, 
//     category, 
//     allottedDate, 
//     returnDate, 
//     status, 
//     batch, 
//     currentEmployee,
//     previousEmployees 
//   });
  
//   try {
//     const newAsset = await asset.save();
//     res.status(201).json(newAsset);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// router.put('/:id', async (req, res) => {
//   // Update to include all fields that can be updated
//   const { 
//     name,           // Added name
//     category,       // Added category
//     status, 
//     returnDate, 
//     allottedDate, 
//     currentEmployee, 
//     previousEmployees, // Added previousEmployees
//     batch 
//   } = req.body;
  
//   try {
//     const asset = await Asset.findByIdAndUpdate(
//       req.params.id,
//       { 
//         name,
//         category,
//         status, 
//         returnDate, 
//         allottedDate, 
//         currentEmployee, 
//         previousEmployees,
//         batch 
//       },
//       { new: true, runValidators: true }
//     );

//     if (!asset) return res.status(404).json({ message: 'Asset not found' });
//     res.json(asset);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


// // DELETE an asset
// router.delete('/:id', async (req, res) => {
//   try {
//     const asset = await Asset.findByIdAndDelete(req.params.id);
//     if (!asset) return res.status(404).json({ message: 'Asset not found' });
//     res.json({ message: 'Asset deleted' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // GET summary data for the dashboard
// router.get('/summary', async (req, res) => {
//   try {
//     const totalAssets = await Asset.countDocuments();
//     const assetsInUse = await Asset.countDocuments({ status: "In Use" });
//     const categoryData = await Asset.aggregate([
//       { $group: { _id: "$category", count: { $sum: 1 } } },
//     ]);
//     const statusData = await Asset.aggregate([
//       { $group: { _id: "$status", count: { $sum: 1 } } },
//     ]);

//     res.json({ totalAssets, assetsInUse, categoryData, statusData });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching summary data" });
//   }
// });

// export default router;

import express from 'express';
import { authenticate } from '../middleware/companyAuth.js';
import { 
  getAllAssets, 
  createAsset, 
  updateAsset, 
  deleteAsset, 
  getSummaryData 
} from '../controllers/assetHistoryController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// GET all assets
router.get('/', getAllAssets);

// POST create a new asset
router.post('/', createAsset);

// PUT update an asset
router.put('/:id', updateAsset);

// DELETE an asset
router.delete('/:id', deleteAsset);

// GET summary data for the dashboard
router.get('/summary', getSummaryData);

export default router;
