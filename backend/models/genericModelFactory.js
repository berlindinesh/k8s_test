// import createCompanyModel from './modelFactory.js';

// // Function to create a company-specific model
// const createCompanySpecificModel = async (companyCode, modelName, schema) => {
//   return await createCompanyModel(companyCode, modelName, schema);
// };

// // Function to get or create a model for a specific company
// const getModelForCompany = async (companyCode, modelName, schema) => {
//   return await createCompanySpecificModel(companyCode, modelName, schema);
// };

// export default getModelForCompany;

import createCompanyModel from './modelFactory.js';

// Function to create a company-specific model
const createCompanySpecificModel = async (companyCode, modelName, schema) => {
  console.log(`Creating company-specific model: ${modelName} for company ${companyCode}`);
  try {
    const model = await createCompanyModel(companyCode, modelName, schema);
    console.log(`Successfully created model: ${modelName} for company ${companyCode}`);
    return model;
  } catch (error) {
    console.error(`Error creating model ${modelName} for company ${companyCode}:`, error);
    throw error;
  }
};

// Function to get or create a model for a specific company
const getModelForCompany = async (companyCode, modelName, schema) => {
  if (!companyCode) {
    throw new Error(`Company code is required to get model for ${modelName}`);
  }
  if (!schema) {
    throw new Error(`Schema is required to get model for ${modelName}`);
  }
  return await createCompanySpecificModel(companyCode, modelName, schema);
};

export default getModelForCompany;
