// routes/assetDashboardRoutes.js
import express from 'express';
import AssetHistory from '../models/AssetHistory.js';
const router = express.Router();

// Route to get summary data for the dashboard
router.get('/summary', async (req, res) => {
  try {
    // Get the total count of assets
    const totalAssets = await AssetHistory.countDocuments();

    // Get count of assets currently in use
    const assetsInUse = await AssetHistory.countDocuments({ status: 'In Use' });

    // Group by category and get the count of assets in each category
    const categoryData = await AssetHistory.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Group by status and get the count of assets in each status
    const statusData = await AssetHistory.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Send the data as a response
    res.json({
      totalAssets,
      assetsInUse,
      categoryData,
      statusData,
    });
  } catch (error) {
    console.error('Error fetching summary data:', error);
    res.status(500).json({ message: 'Error fetching summary data' });
  }
});

export default router;