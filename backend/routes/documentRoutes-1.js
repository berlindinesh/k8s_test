import express from 'express';
import multer from 'multer';
import { 
  uploadDocument, 
  getEmployeeDocuments, 
  getFamilyDocuments,
  getEducationDocuments,
  updateDocumentStatus 
} from '../controllers/documentController-1.js';

const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage: storage });

// Document routes
router.post('/upload', upload.single('file'), uploadDocument);
router.get('/employee/:employeeId', getEmployeeDocuments);
router.get('/family/:employeeId', getFamilyDocuments);
router.get('/education/:employeeId', getEducationDocuments);
router.patch('/:id/status', updateDocumentStatus);

export default router;
