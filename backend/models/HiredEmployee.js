import mongoose from 'mongoose';

const hiredEmployeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    joiningDate: {
        type: Date,
        required: true
    },
    probationEnds: {
        type: Date,
        required: true
    },
    jobPosition: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
        enum: ['Engineering', 'Product', 'Marketing', 'Sales', 'HR']
    },
    recruitment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Offer Letter Accepted', 'Offer Letter Rejected'],
        default: 'Pending'
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

// Create model for HiredEmployee in the main database (for backward compatibility)
const HiredEmployee = mongoose.model('HiredEmployee', hiredEmployeeSchema);

// Export the schema for company-specific models
export { hiredEmployeeSchema };

// Export the main model as default
export default HiredEmployee;
