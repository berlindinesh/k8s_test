// import express from 'express'
// import {
//   getAllTemplates,
//   addTemplate,
//   updateTemplate,
//   deleteQuestion,
//   deleteTemplate,
// } from '../controllers/surveyController.js';

// const router = express.Router();

// // Get all survey templates
// router.get('/api/recruitment-survey', getAllTemplates);

// // Add a new template
// router.post('/api/recruitment-survey/add', addTemplate);

// // Edit a template by ID
// router.put('/api/recruitment-survey/:id', updateTemplate);

// // Delete a question by template and question ID
// router.delete('/api/recruitment-survey/:templateId/questions/:questionId', deleteQuestion);

// // Delete a template by ID
// router.delete('/api/recruitment-survey/:id', deleteTemplate);

// export default router




// import express from 'express'
// import {
//   getAllTemplates,
//   addTemplate,
//   addQuestionToTemplate,
//   updateTemplate,
//   updateQuestion,
//   deleteQuestion,
//   deleteTemplate
// } from '../controllers/surveyController.js';

// const router = express.Router();

// // Get all survey templates
// router.get('/api/recruitment-survey', getAllTemplates);

// // Add a new template
// router.post('/api/recruitment-survey/add', addTemplate);

// // Add a new question to an existing template
// router.post('/api/recruitment-survey/:templateId/questions', addQuestionToTemplate);

// // Edit a template by ID
// router.put('/api/recruitment-survey/:id', updateTemplate);

// // Edit a question in a template
// router.put('/api/recruitment-survey/:templateId/questions/:questionId', updateQuestion);

// // Delete a question by template and question ID
// router.delete('/api/recruitment-survey/:templateId/questions/:questionId', deleteQuestion);

// // Delete a template by ID
// router.delete('/api/recruitment-survey/:id', deleteTemplate);

// export default router





import express from 'express';
import {
  getAllTemplates,
  addTemplate,
  addQuestionToTemplate,
  updateTemplate,
  updateQuestion,
  deleteQuestion,
  deleteTemplate
} from '../controllers/surveyController.js';
// Import the authenticate middleware from the correct path
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Get all survey templates
router.get('/api/recruitment-survey', getAllTemplates);

// Add a new template
router.post('/api/recruitment-survey/add', addTemplate);

// Add a new question to an existing template
router.post('/api/recruitment-survey/:templateId/questions', addQuestionToTemplate);

// Edit a template by ID
router.put('/api/recruitment-survey/:id', updateTemplate);

// Edit a question in a template
router.put('/api/recruitment-survey/:templateId/questions/:questionId', updateQuestion);

// Delete a question by template and question ID
router.delete('/api/recruitment-survey/:templateId/questions/:questionId', deleteQuestion);

// Delete a template by ID
router.delete('/api/recruitment-survey/:id', deleteTemplate);

export default router;
