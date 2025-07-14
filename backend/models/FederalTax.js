import mongoose from 'mongoose';

const federalTaxSchema = new mongoose.Schema({
    taxRate: {
        type: String,
        required: true
    },
    minIncome: {
        type: String,
        required: true
    },
    maxIncome: {
        type: String,
        required: true
    },
    pythonCode: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    }
}, { timestamps: true });

const FederalTax = mongoose.model('FederalTax', federalTaxSchema);
export default FederalTax;
