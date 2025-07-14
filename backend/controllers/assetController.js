import Asset from '../models/Asset.js';
import AssetBatch from '../models/AssetBatch.js';

// Add this function to create assets from a batch
// Make sure createAssetsFromBatch is properly implemented
export const createAssetsFromBatch = async (req, res) => {
  try {
    const { batchId, assetNames, category } = req.body;
    
    // Validate batch exists
    const batch = await AssetBatch.findById(batchId);
    if (!batch) {
      return res.status(404).json({ message: 'Asset batch not found' });
    }
    
    console.log(`Creating ${assetNames.length} assets from batch ${batch.batchNumber}`);
    
    // Create assets
    const assets = [];
    for (const name of assetNames) {
      const asset = new Asset({
        name,
        category: category || 'Hardware',
        status: 'Available',
        batch: batch.batchNumber // Store the batch number, not the ID
      });
      await asset.save();
      assets.push(asset);
    }
    
    console.log(`Successfully created ${assets.length} assets`);
    
    res.status(201).json({
      success: true,
      data: assets,
      message: `${assets.length} assets created successfully from batch ${batch.batchNumber}`
    });
  } catch (error) {
    console.error('Error in createAssetsFromBatch:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};