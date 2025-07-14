import axios from 'axios';

// const BASE_URL = 'http://localhost:5002/api/contracts';

export const getContractsByEmployeeId = async (userId) => {
  const response = await axios.get(`/api/contracts/employee/${userId}`);
  return response.data.data
};

export const createContract = async (contractData) => {
  const response = await axios.post('/api/contracts/', contractData);
  return response.data.data;
};

export const updateContract = async (contractId, contractData) => {
  const response = await axios.put(`/api/contracts/${contractId}`, contractData);
  return response.data.data;
};

export const deleteContract = async (contractId) => {
  await axios.delete(`/api/contracts/${contractId}`);
};
