import mongoose from 'mongoose';
import { getCompanyConnection } from '../config/db.js';

// Cache for company models
const modelCache = {};

// Create a model for a specific company
const createCompanyModel = async (companyCode, modelName, schema) => {
    if (!companyCode) {
        throw new Error('Company code is required');
    }
    
    // Normalize company code
    companyCode = companyCode.toUpperCase();
    
    // Create a cache key
    const cacheKey = `${companyCode}_${modelName}`;
    
    // Return cached model if available
    if (modelCache[cacheKey]) {
        return modelCache[cacheKey];
    }
    
    // Get connection for this company
    const connection = await getCompanyConnection(companyCode);
    
    // Create model with this connection
    const model = connection.model(modelName, schema);
    
    // Cache the model
    modelCache[cacheKey] = model;
    
    return model;
};

export default createCompanyModel;
