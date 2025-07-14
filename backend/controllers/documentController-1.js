import documents from '../models/Document-1.js';

export const uploadDocument = async (req, res) => {
  try {
    const document = new Document({
      employeeId: req.body.employeeId,
      category: req.body.category,
      documentType: req.body.documentType,
      fileName: req.file.originalname,
      fileUrl: req.file.path,
      relatedTo: req.body.relatedTo || 'self'
    });
    
    const savedDocument = await document.save();
    res.status(201).json(savedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getEmployeeDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ 
      employeeId: req.params.employeeId 
    });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFamilyDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      employeeId: req.params.employeeId,
      category: 'Personal',
      documentType: 'familyAadhar'
    });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getEducationDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      employeeId: req.params.employeeId,
      category: 'Education'
    });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDocumentStatus = async (req, res) => {
  try {
    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updatedDocument);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
