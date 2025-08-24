import api from '../../../api/axiosInstance';

export const assetService = {
  fetchAssets: () => api.get('assets'),
  addAsset: (asset) => api.post('assets', asset),
  updateAsset: (id, asset) => api.put(`assets/${id}`, asset),
  deleteAsset: (id) => api.delete(`assets/${id}`),
  searchAssets: (query) => api.get(`assets/search?q=${query}`),
  getAssetHistory: () => api.get('assets/history'),
  getAssetBatches: () => api.get('assets/batches'),
};
