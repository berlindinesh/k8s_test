import express from 'express'
import { getContractsByEmployeeId, updateContract, deleteContract } from '../controllers/contractController.js'

const router = express.Router()

router.get('/employee/:userId', getContractsByEmployeeId)
router.put('/:contractId', updateContract)
router.delete('/:contractId', deleteContract)

export default router