// routes/employeeRoutes.js
import express from 'express'
const router = express.Router();
import {getEmployees, createEmployee, updateEmployee, deleteEmployee} from '../controllers/employeeController.js';

router.get('/employees', getEmployees); // Fetch employees with optional query params
router.post('/employees', createEmployee); // Create new employee
router.put('/employees/:id', updateEmployee); // Update employee
router.delete('/employees/:id', deleteEmployee); // Delete employee

export default router
