import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'In Use', 'Under Maintenance', 'Under Service', 'Disposed'],
    default: 'Available'
  },
  currentEmployee: {
    type: String,
    trim: true
  },
  previousEmployees: [{
    type: String,
    trim: true
  }],
  allottedDate: {
    type: Date
  },
  returnDate: {
    type: Date
  },
  batch: {
    type: String,
    trim: true,
    ref: 'AssetBatch' // Reference to the AssetBatch model
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Asset = mongoose.model('Asset', assetSchema);

export default Asset;
// In your assetController.js
export const createAssetsFromBatch = async (req, res) => {
  try {
    const { batchId, assetNames, category, batch } = req.body;
    
    // Validate batch exists
    const batchDoc = await AssetBatch.findById(batchId);
    if (!batchDoc) {
      return res.status(404).json({ message: 'Asset batch not found' });
    }
    
    console.log(`Creating ${assetNames.length} assets from batch ${batch}`);
    
    // Create assets
    const assets = [];
    for (const name of assetNames) {
      const asset = new Asset({
        name,
        category: category || 'Hardware',
        status: 'Available',
        batch: batch // Use the batch number from the request
      });
      await asset.save();
      assets.push(asset);
    }
    
    console.log(`Successfully created ${assets.length} assets`);
    
    res.status(201).json({
      success: true,
      data: assets,
      message: `${assets.length} assets created successfully from batch ${batch}`
    });
  } catch (error) {
    console.error('Error in createAssetsFromBatch:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};