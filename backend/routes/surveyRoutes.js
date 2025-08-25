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
router.get('/recruitment-survey', getAllTemplates);

// Add a new template
router.post('/recruitment-survey/add', addTemplate);

// Add a new question to an existing template
router.post('/recruitment-survey/:templateId/questions', addQuestionToTemplate);

// Edit a template by ID
router.put('/recruitment-survey/:id', updateTemplate);

// Edit a question in a template
router.put('/recruitment-survey/:templateId/questions/:questionId', updateQuestion);

// Delete a question by template and question ID
router.delete('/recruitment-survey/:templateId/questions/:questionId', deleteQuestion);

// Delete a template by ID
router.delete('/recruitment-survey/:id', deleteTemplate);

export default router;
