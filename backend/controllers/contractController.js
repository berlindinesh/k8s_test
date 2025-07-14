import Contract from "../models/contractModels.js";

// Create a new contract
export const createContract = async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all contracts for a specific employee
export const getContractsByEmployeeId = async (req, res) => {
  const { userId } = req.params;
  try {
    const contracts = await Contract.find({ employeeId: userId });
    res.status(200).json({ success: true, data: contracts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a specific contract by ID
export const getContractById = async (req, res) => {
  const { id } = req.params;
  try {
    const contract = await Contract.findById(id);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    res.status(200).json({ success: true, data: contract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a contract
export const updateContract = async (req, res) => {
  const { contractId } = req.params;
  try {
    const updatedContract = await Contract.findByIdAndUpdate(contractId, req.body, { new: true });
    if (!updatedContract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    res.status(200).json({ success: true, data: updatedContract });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a contract
export const deleteContract = async (req, res) => {
  const { contractId } = req.params;
  try {
    const deletedContract = await Contract.findByIdAndDelete(contractId);
    if (!deletedContract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }
    res.status(200).json({ success: true, message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
