// // import Template from '../models/surveyModel.js';

// // // Fetch all survey templates
// // export const getAllTemplates = async (req, res) => {
// //   try {
// //     const templates = await Template.find();
// //     res.status(200).json(templates);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error fetching templates', error });
// //   }
// // };

// // // Add a new template
// //  export const addTemplate = async (req, res) => {
// //   const { name, questions } = req.body;
// //   try {
// //     const newTemplate = new Template({ name, questions });
// //     await newTemplate.save();
// //     res.status(201).json(newTemplate);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error adding template', error });
// //   }
// // };

// // // Edit a template by ID
// // export const updateTemplate = async (req, res) => {
// //   const { id } = req.params;
// //   const { name, questions } = req.body;
// //   try {
// //     const updatedTemplate = await Template.findByIdAndUpdate(
// //       id,
// //       { name, questions },
// //       { new: true }
// //     );
// //     if (!updatedTemplate) {
// //       return res.status(404).json({ message: 'Template not found' });
// //     }
// //     res.status(200).json(updatedTemplate);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error updating template', error });
// //   }
// // };

// // // Delete a question from a template by template ID and question ID
// // export const deleteQuestion = async (req, res) => {
// //   const { templateId, questionId } = req.params;
// //   try {
// //     const template = await Template.findById(templateId);
// //     if (!template) {
// //       return res.status(404).json({ message: 'Template not found' });
// //     }

// //     template.questions = template.questions.filter(
// //       (question) => question._id.toString() !== questionId
// //     );
// //     await template.save();
// //     res.status(200).json({ message: 'Question deleted successfully', template });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error deleting question', error });
// //   }
// // };

// // // Delete an entire template by ID
// // export const deleteTemplate = async (req, res) => {
// //   const { id } = req.params;
// //   try {
// //     const deletedTemplate = await Template.findByIdAndDelete(id);
// //     if (!deletedTemplate) {
// //       return res.status(404).json({ message: 'Template not found' });
// //     }
// //     res.status(200).json({ message: 'Template deleted successfully' });
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error deleting template', error });
// //   }
// // };

// import Template from '../models/surveyModel.js';

// // Fetch all survey templates
// export const getAllTemplates = async (req, res) => {
//   try {
//     const templates = await Template.find();
//     res.status(200).json(templates);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching templates', error });
//   }
// };

// // Add a new template
// // export const addTemplate = async (req, res) => {
// //   const { name, questions } = req.body;
// //   try {
// //     const newTemplate = new Template({ name, questions });
// //     await newTemplate.save();
// //     res.status(201).json(newTemplate);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error adding template', error });
// //   }
// // };
// // Add a new template
// export const addTemplate = async (req, res) => {
//   const { name, questions } = req.body;
//   try {
//     // Make sure each question has all necessary fields
//     const processedQuestions = questions.map(q => ({
//       avatar: q.avatar,
//       question: q.question,
//       type: q.type,
//       employeeId: q.employeeId,
//       employeeName: q.employeeName,
//       employeeDepartment: q.employeeDepartment,
//       employeeDesignation: q.employeeDesignation
//     }));

//     const newTemplate = new Template({ 
//       name, 
//       questions: processedQuestions 
//     });
    
//     await newTemplate.save();
//     res.status(201).json(newTemplate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding template', error });
//   }
// };


// // Add a new question to an existing template
// // export const addQuestionToTemplate = async (req, res) => {
// //   const { templateId } = req.params;
// //   const { question, type } = req.body;
  
// //   try {
// //     const template = await Template.findById(templateId);
// //     if (!template) {
// //       return res.status(404).json({ message: 'Template not found' });
// //     }
    
// //     const newQuestion = {
// //       avatar: question.charAt(0).toUpperCase(),
// //       question,
// //       type
// //     };
    
// //     template.questions.push(newQuestion);
// //     await template.save();
    
// //     res.status(200).json(template);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error adding question to template', error });
// //   }
// // };
// // Add a new question to an existing template
// export const addQuestionToTemplate = async (req, res) => {
//   const { templateId } = req.params;
//   const { question, type, employeeId, employeeName, employeeDepartment, employeeDesignation } = req.body;
  
//   try {
//     const template = await Template.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
    
//     const newQuestion = {
//       avatar: question.charAt(0).toUpperCase(),
//       question,
//       type,
//       employeeId,
//       employeeName,
//       employeeDepartment,
//       employeeDesignation
//     };
    
//     template.questions.push(newQuestion);
//     await template.save();
    
//     res.status(200).json(template);
//   } catch (error) {
//     res.status(500).json({ message: 'Error adding question to template', error });
//   }
// };

// // Edit a template by ID
// export const updateTemplate = async (req, res) => {
//   const { id } = req.params;
//   const { name, questions } = req.body;
//   try {
//     const updatedTemplate = await Template.findByIdAndUpdate(
//       id,
//       { name, questions },
//       { new: true }
//     );
//     if (!updatedTemplate) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
//     res.status(200).json(updatedTemplate);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating template', error });
//   }
// };

// // Edit a question in a template
// // export const updateQuestion = async (req, res) => {
// //   const { templateId, questionId } = req.params;
// //   const { question, type } = req.body;
  
// //   try {
// //     const template = await Template.findById(templateId);
// //     if (!template) {
// //       return res.status(404).json({ message: 'Template not found' });
// //     }
    
// //     const questionIndex = template.questions.findIndex(
// //       q => q._id.toString() === questionId
// //     );
    
// //     if (questionIndex === -1) {
// //       return res.status(404).json({ message: 'Question not found' });
// //     }
    
// //     template.questions[questionIndex].question = question;
// //     template.questions[questionIndex].type = type;
    
// //     await template.save();
// //     res.status(200).json(template);
// //   } catch (error) {
// //     res.status(500).json({ message: 'Error updating question', error });
// //   }
// // };
// export const updateQuestion = async (req, res) => {
//   const { templateId, questionId } = req.params;
//   const { question, type, employeeId, employeeName, employeeDepartment, employeeDesignation } = req.body;
  
//   try {
//     const template = await Template.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
    
//     const questionIndex = template.questions.findIndex(
//       q => q._id.toString() === questionId
//     );
    
//     if (questionIndex === -1) {
//       return res.status(404).json({ message: 'Question not found' });
//     }
    
//     template.questions[questionIndex].question = question;
//     template.questions[questionIndex].type = type;
//     template.questions[questionIndex].employeeId = employeeId;
//     template.questions[questionIndex].employeeName = employeeName;
//     template.questions[questionIndex].employeeDepartment = employeeDepartment;
//     template.questions[questionIndex].employeeDesignation = employeeDesignation;
    
//     await template.save();
//     res.status(200).json(template);
//   } catch (error) {
//     res.status(500).json({ message: 'Error updating question', error });
//   }
// };

// // Delete a question from a template by template ID and question ID
// export const deleteQuestion = async (req, res) => {
//   const { templateId, questionId } = req.params;
//   try {
//     const template = await Template.findById(templateId);
//     if (!template) {
//       return res.status(404).json({ message: 'Template not found' });
//     }

//     template.questions = template.questions.filter(
//       (question) => question._id.toString() !== questionId
//     );
//     await template.save();
//     res.status(200).json({ message: 'Question deleted successfully', template });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting question', error });
//   }
// };

// // Delete an entire template by ID
// export const deleteTemplate = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const deletedTemplate = await Template.findByIdAndDelete(id);
//     if (!deletedTemplate) {
//       return res.status(404).json({ message: 'Template not found' });
//     }
//     res.status(200).json({ message: 'Template deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting template', error });
//   }
// };



import Template, { templateSchema } from '../models/surveyModel.js';
import getModelForCompany from '../models/genericModelFactory.js';

// Fetch all survey templates
export const getAllTemplates = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Fetching survey templates for company: ${companyCode}`);
    
    // Get company-specific Template model
    const CompanyTemplate = await getModelForCompany(companyCode, 'Template', templateSchema);
    
    // Get templates from company database
    const templates = await CompanyTemplate.find();
    
    console.log(`Retrieved ${templates.length} templates for company ${companyCode}`);
    res.status(200).json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ 
      error: 'Error fetching templates', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a new template
export const addTemplate = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    console.log(`Creating survey template for company: ${companyCode}`);
    
    // Get company-specific Template model
    const CompanyTemplate = await getModelForCompany(companyCode, 'Template', templateSchema);
    
    const { name, questions } = req.body;
    
    if (!name || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and questions array are required'
      });
    }
    
    // Make sure each question has all necessary fields
    const processedQuestions = questions.map(q => ({
      avatar: q.avatar,
      question: q.question,
      type: q.type,
      employeeId: q.employeeId,
      employeeName: q.employeeName,
      employeeDepartment: q.employeeDepartment,
      employeeDesignation: q.employeeDesignation
    }));

    const newTemplate = new CompanyTemplate({ 
      name, 
      questions: processedQuestions 
    });
    
    await newTemplate.save();
    
    console.log(`Template created successfully for company ${companyCode}`);
    res.status(201).json(newTemplate);
  } catch (error) {
    console.error('Error adding template:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({ 
      error: 'Error adding template', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Add a new question to an existing template
export const addQuestionToTemplate = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { templateId } = req.params;
    if (!templateId) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Template ID is required' 
      });
    }
    
    console.log(`Adding question to template ${templateId} for company: ${companyCode}`);
    
    // Get company-specific Template model
    const CompanyTemplate = await getModelForCompany(companyCode, 'Template', templateSchema);
    
    const { question, type, employeeId, employeeName, employeeDepartment, employeeDesignation } = req.body;
    
    if (!question || !type) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Question and type are required'
      });
    }
    
    const template = await CompanyTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: `No template found with ID: ${templateId}`
      });
    }
    
    const newQuestion = {
      avatar: question.charAt(0).toUpperCase(),
      question,
      type,
      employeeId,
      employeeName,
      employeeDepartment,
      employeeDesignation
    };
    
    template.questions.push(newQuestion);
    await template.save();
    
    console.log(`Question added to template ${templateId} successfully`);
    res.status(200).json(template);
  } catch (error) {
    console.error('Error adding question to template:', error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided template ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error adding question to template', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Edit a template by ID
export const updateTemplate = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Template ID is required' 
      });
    }
    
    console.log(`Updating template ${id} for company: ${companyCode}`);
    
    // Get company-specific Template model
    const CompanyTemplate = await getModelForCompany(companyCode, 'Template', templateSchema);
    
    const { name, questions } = req.body;
    
    if (!name || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Name and questions array are required'
      });
    }
    
    const updatedTemplate = await CompanyTemplate.findByIdAndUpdate(
      id,
      { name, questions },
      { new: true, runValidators: true }
    );
    
    if (!updatedTemplate) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: `No template found with ID: ${id}`
      });
    }
    
    console.log(`Template ${id} updated successfully`);
    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error(`Error updating template ${req.params.id}:`, error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        message: error.message,
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided template ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error updating template', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Edit a question in a template
export const updateQuestion = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { templateId, questionId } = req.params;
    if (!templateId || !questionId) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Template ID and Question ID are required' 
      });
    }
    
    console.log(`Updating question ${questionId} in template ${templateId} for company: ${companyCode}`);
    
    // Get company-specific Template model
    const CompanyTemplate = await getModelForCompany(companyCode, 'Template', templateSchema);
    
    const { question, type, employeeId, employeeName, employeeDepartment, employeeDesignation } = req.body;
    
    if (!question || !type) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'Question and type are required'
      });
    }
    
    const template = await CompanyTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: `No template found with ID: ${templateId}`
      });
    }
    
    const questionIndex = template.questions.findIndex(
      q => q._id.toString() === questionId
    );
    
    if (questionIndex === -1) {
      return res.status(404).json({ 
        error: 'Question not found',
        message: `No question found with ID: ${questionId}`
      });
    }
    
    template.questions[questionIndex].question = question;
    template.questions[questionIndex].type = type;
    template.questions[questionIndex].employeeId = employeeId;
    template.questions[questionIndex].employeeName = employeeName;
    template.questions[questionIndex].employeeDepartment = employeeDepartment;
    template.questions[questionIndex].employeeDesignation = employeeDesignation;
    
    await template.save();
    
    console.log(`Question ${questionId} updated successfully`);
    res.status(200).json(template);
  } catch (error) {
    console.error(`Error updating question:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'One of the provided IDs is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error updating question', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete a question from a template by template ID and question ID
export const deleteQuestion = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { templateId, questionId } = req.params;
    if (!templateId || !questionId) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Template ID and Question ID are required' 
      });
    }
    
    console.log(`Deleting question ${questionId} from template ${templateId} for company: ${companyCode}`);
    
    // Get company-specific Template model
    const CompanyTemplate = await getModelForCompany(companyCode, 'Template', templateSchema);
    
    const template = await CompanyTemplate.findById(templateId);
    if (!template) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: `No template found with ID: ${templateId}`
      });
    }

    const originalLength = template.questions.length;
    template.questions = template.questions.filter(
      (question) => question._id.toString() !== questionId
    );
    
    if (template.questions.length === originalLength) {
      return res.status(404).json({ 
        error: 'Question not found',
        message: `No question found with ID: ${questionId}`
      });
    }
    
    await template.save();
    
    console.log(`Question ${questionId} deleted successfully`);
    res.status(200).json({ 
      message: 'Question deleted successfully', 
      template 
    });
  } catch (error) {
    console.error(`Error deleting question:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'One of the provided IDs is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error deleting question', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Delete an entire template by ID
export const deleteTemplate = async (req, res) => {
  try {
    // Get company code from authenticated user
    const companyCode = req.companyCode;
    
    if (!companyCode) {
      return res.status(401).json({ 
        error: 'Authentication required', 
        message: 'Company code not found in request' 
      });
    }
    
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ 
        error: 'Invalid request', 
        message: 'Template ID is required' 
      });
    }
    
    console.log(`Deleting template ${id} for company: ${companyCode}`);
    
    // Get company-specific Template model
    const CompanyTemplate = await getModelForCompany(companyCode, 'Template', templateSchema);
    
    const deletedTemplate = await CompanyTemplate.findByIdAndDelete(id);
    
    if (!deletedTemplate) {
      return res.status(404).json({ 
        error: 'Template not found',
        message: `No template found with ID: ${id}`
      });
    }
    
    console.log(`Template ${id} deleted successfully`);
    res.status(200).json({ 
      message: 'Template deleted successfully',
      deletedTemplate: {
        id: deletedTemplate._id,
        name: deletedTemplate.name,
        questionCount: deletedTemplate.questions.length
      }
    });
  } catch (error) {
    console.error(`Error deleting template ${req.params.id}:`, error);
    
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(400).json({
        error: 'Invalid ID',
        message: 'The provided template ID is not valid'
      });
    }
    
    res.status(500).json({ 
      error: 'Error deleting template', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
