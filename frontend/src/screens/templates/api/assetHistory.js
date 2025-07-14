// src/api/assetHistory.js
import axios from 'axios';

const API_URL = `${process.env.REACT_APP_API_URL}/api/assetHistory`;

const assetHistoryAPI = {
  getAssets: () => axios.get(API_URL),
  createAsset: (asset) => axios.post(API_URL, asset),
  updateAsset: (id, updatedAsset) => axios.put(`${API_URL}/${id}`, updatedAsset),
  deleteAsset: (id) => axios.delete(`${API_URL}/${id}`)
};

export const { getAssets, createAsset, updateAsset, deleteAsset } = assetHistoryAPI;
