import mongoose from 'mongoose';

const AssetHistorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  allottedDate: { type: Date }, // Remove required: true
  returnDate: { type: Date },
  status: { 
    type: String, 
    enum: ['In Use', 'Returned', 'Under Service', 'Available', 'Under Maintenance'], 
    required: true 
  },
  batch: { type: String, default: "" },
  currentEmployee: { type: String, default: "" }, // Add default
  previousEmployees: [{ type: String }] // This is correct
});

console.log("AssetHistory Schema initialized");

const AssetHistory = mongoose.model('AssetHistory', AssetHistorySchema);

export { AssetHistorySchema };
export default AssetHistory;
