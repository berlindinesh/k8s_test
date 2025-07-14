// import mongoose from 'mongoose';

// const FaqSchema = new mongoose.Schema({
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'FaqCategory', required: true },
//     question: { type: String, required: true },
//     answer: { type: String, required: true },
// }, { timestamps: true });

// export default mongoose.model('Faq', FaqSchema);

import mongoose from 'mongoose';

const FaqSchema = new mongoose.Schema({
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'FaqCategory', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
}, { timestamps: true });

// Create model for Faq in the main database (for backward compatibility)
const Faq = mongoose.model('Faq', FaqSchema);

// Export the schema for company-specific models
export { FaqSchema };

// Export the main model as default
export default Faq;
