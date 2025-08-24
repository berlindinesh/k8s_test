// src/api/assetHistory.js
import api from '../../../api/axiosInstance';

const assetHistoryAPI = {
  getAssets: () => api.get('assetHistory'),
  createAsset: (asset) => api.post('assetHistory', asset),
  updateAsset: (id, updatedAsset) => api.put(`assetHistory/${id}`, updatedAsset),
  deleteAsset: (id) => api.delete(`assetHistory/${id}`)
};


export const { getAssets, createAsset, updateAsset, deleteAsset } = assetHistoryAPI;
