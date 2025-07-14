// import mongoose from 'mongoose';

// const holidaySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     recurring: { type: Boolean, default: false }
// });

// export default mongoose.model('Holiday', holidaySchema);

import mongoose from 'mongoose';


const holidaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    recurring: { type: Boolean, default: false }
});

// Create model for Holiday in the main database (for backward compatibility)
const Holiday = mongoose.model('Holiday', holidaySchema);

// Export the schema for company-specific models
export { holidaySchema };

// Export the main model as default
export default Holiday;
