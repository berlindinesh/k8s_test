import express from 'express';
import { PayrollController } from '../controllers/PayrollController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Employee routes
router.get('/employees', PayrollController.getAllEmployees);
router.post('/employees', PayrollController.createEmployee);
router.put('/employees/:empId', PayrollController.updateEmployee);
router.put('/employees/:empId/lop', PayrollController.updateEmployeeLOP);
router.delete('/employees/:empId', PayrollController.deleteEmployee);
router.post('/employees/bulk', PayrollController.bulkCreateEmployees);

// Allowance routes
router.get('/allowances', PayrollController.getAllAllowances);
router.post('/allowances', PayrollController.createAllowance);
router.put('/allowances/:id', PayrollController.updateAllowance);
router.delete('/allowances/:id', PayrollController.deleteAllowance);

// Deduction routes
router.get('/deductions', PayrollController.getAllDeductions);
router.post('/deductions', PayrollController.createDeduction);
router.put('/deductions/:id', PayrollController.updateDeduction);
router.delete('/deductions/:id', PayrollController.deleteDeduction);

// Payslip routes
router.post('/payslips/generate', PayrollController.generatePayslip);
router.get('/payslips/download/:id', PayrollController.downloadPayslip);
router.get('/payslips/employee/:empId', PayrollController.getPayslipsByEmployee);
router.get('/payslips/month', PayrollController.getPayslipsByMonth);
router.post('/payslips/bulk-generate', PayrollController.bulkGeneratePayslips);
router.get('/payslips', PayrollController.getAllPayslips);

// route for calculating base after deductions
router.get('/calculate-base/:empId', PayrollController.calculateBaseAfterDeductions);



// NEW: User-specific payslip routes
router.get('/my-payslips', PayrollController.getUserPayslips);
router.get('/my-payslips/:payslipId/download', PayrollController.downloadUserPayslip);

// NEW: Route to link user account to employee record
router.post('/link-employee', PayrollController.linkUserToEmployee);

export default router;
