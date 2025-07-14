// import mongoose from 'mongoose';

// const FaqCategorySchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     description: { type: String },
// }, { timestamps: true });

// export default mongoose.model('FaqCategory', FaqCategorySchema);

import mongoose from 'mongoose';

const FaqCategorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
}, { timestamps: true });

// Create model for FaqCategory in the main database (for backward compatibility)
const FaqCategory = mongoose.model('FaqCategory', FaqCategorySchema);

// Export the schema for company-specific models
export { FaqCategorySchema };

// Export the main model as default
export default FaqCategory;
