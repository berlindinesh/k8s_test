import express from 'express';
import Asset from '../models/Asset.js';
const router = express.Router();

// Get all assets with optional filtering by category and name
router.get('/', async (req, res) => {
  try {
    const { category, name } = req.query;
    
    // Create a query object based on filters
    const query = {};
    if (category) query.category = category;
    if (name) query.name = { $regex: name, $options: 'i' }; // Case-insensitive search

    const assets = await Asset.find(query);
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching assets' });
  }
});

// Add a new asset
router.post('/', async (req, res) => {
  const { name, category, status, currentEmployee, previousEmployees } = req.body;
  const asset = new Asset({
    name,
    category,
    status,
    currentEmployee,
    previousEmployees,
  });

  try {
    const newAsset = await asset.save();
    res.status(201).json(newAsset);
  } catch (err) {
    res.status(400).json({ error: 'Error adding asset' });
  }
});

// Update an existing asset
router.put('/:id', async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAsset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.json(updatedAsset);
  } catch (err) {
    res.status(500).json({ error: 'Error updating asset' });
  }
});

// Delete an asset
router.delete('/:id', async (req, res) => {
  try {
    const asset = await Asset.findByIdAndDelete(req.params.id);
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    res.status(200).json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting asset' });
  }
});

export default router;
