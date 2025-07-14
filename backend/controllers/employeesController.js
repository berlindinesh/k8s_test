import EmployeeRegister from '../models/employeeRegisterModel.js';

// ✅ Generate Unique Employee Code
export const generateEmployeeCode = async () => {
  try {
    const latestEmployee = await EmployeeRegister.findOne().sort({ Emp_ID: -1 });
    if (!latestEmployee || !latestEmployee.Emp_ID) {
      return 'DB-0001';
    }
    const currentNumber = parseInt(latestEmployee.Emp_ID.split('-')[1], 10);
    return `DB-${String(currentNumber + 1).padStart(4, '0')}`;
  } catch (error) {
    throw new Error('Failed to generate employee code');
  }
};

// ✅ Centralized Error Handler
export const handleError = (error) => ({
  success: false,
  details: error.errors ? Object.values(error.errors).map(err => err.message) : [error.message || 'An error occurred']
});

// ✅ Save or Update Personal Info
export const savePersonalInfo = async (req, res) => {
  try {
    const data = JSON.parse(req.body.formData);
    let { Emp_ID, personalInfo } = data;

    if (!Emp_ID) {
      Emp_ID = await generateEmployeeCode();
    }

    let employee = await EmployeeRegister.findOneAndUpdate(
      { Emp_ID },
      { $set: { personalInfo, ...(req.file && { 'personalInfo.employeeImage': req.file.path }) } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, employeeId: employee.Emp_ID, message: 'Personal info saved successfully' });
  } catch (error) {
    res.status(400).json(handleError(error));
  }
};

// ✅ Generic Function for Updating Employee Info
const updateEmployeeField = async (req, res, field) => {
  try {
    const { Emp_ID, formData } = req.body;
    if (!Emp_ID) return res.status(400).json({ success: false, message: 'Emp_ID is required' });

    const employee = await EmployeeRegister.findOneAndUpdate(
      { Emp_ID },
      { $set: { [field]: formData } },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, message: `${field} updated successfully` });
  } catch (error) {
    res.status(500).json(handleError(error));
  }
};

// ✅ Save Address Info
export const saveAddressInfo = (req, res) => updateEmployeeField(req, res, 'addressInfo');

// ✅ Save Joining Details
export const saveJoiningDetails = (req, res) => updateEmployeeField(req, res, 'joiningDetails');

// ✅ Save Education Details
export const saveEducationDetails = (req, res) => updateEmployeeField(req, res, 'educationDetails');

// ✅ Save Family Details
export const saveFamilyDetails = (req, res) => updateEmployeeField(req, res, 'familyDetails');

// ✅ Save Service History
export const saveServiceHistory = (req, res) => updateEmployeeField(req, res, 'serviceHistory');

// ✅ Save Nomination Details
export const saveNominationDetails = (req, res) => updateEmployeeField(req, res, 'nominationDetails');

// ✅ Fetch Employee Data
export const getEmployeeData = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const employee = await EmployeeRegister.findOne({ Emp_ID: employeeId });

    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    res.status(500).json(handleError(error));
  }
};
