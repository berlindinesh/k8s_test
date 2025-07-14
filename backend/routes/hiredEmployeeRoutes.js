import express from 'express';
import {
    getAllHiredEmployees,
    createHiredEmployee,
    updateHiredEmployee,
    deleteHiredEmployee,
    getHiredEmployeeById,
    filterHiredEmployees
} from '../controllers/hiredEmployeeController.js';
import { authenticate } from '../middleware/companyAuth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

router.route('/')
    .get(getAllHiredEmployees)
    .post(createHiredEmployee);

router.get('/filter', filterHiredEmployees);

router.route('/:id')
    .get(getHiredEmployeeById)
    .put(updateHiredEmployee)
    .delete(deleteHiredEmployee);

export default router;

