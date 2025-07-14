// controllers/employeeController.js
import Employees from '../models/Employees.js';

// Get all employees with optional filtering
export const getEmployees = async (req, res) => {
  try {
    const { searchTerm, stage } = req.query;
    const filter = {};

    if (searchTerm) {
      filter.name = { $regex: searchTerm, $options: 'i' };
    }

    if (stage && stage !== 'All') {
      filter.stage = stage;
    }

    const employees = await Employees.find(filter);
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new employee
 export const createEmployee = async (req, res) => {
  try {
    const newEmployee = new Employees(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update employee details
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employees.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an employee
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employees.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
