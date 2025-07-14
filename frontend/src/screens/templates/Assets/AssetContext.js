import React, { createContext, useContext, useState, useEffect } from 'react';
import { assetService } from '../api/assetService';

const AssetContext = createContext();

export const AssetProvider = ({ children }) => {
  const [assets, setAssets] = useState([]);
  const [assetHistory, setAssetHistory] = useState([]);
  const [assetBatches, setAssetBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const assetsResponse = await assetService.fetchAssets();
      const historyResponse = await assetService.getAssetHistory();
      const batchesResponse = await assetService.getAssetBatches();
      setAssets(assetsResponse.data);
      setAssetHistory(historyResponse.data);
      setAssetBatches(batchesResponse.data);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const refreshAssets = async () => {
    await fetchAllData();
  };

  const addNewAsset = async (assetData) => {
    try {
      await assetService.addAsset(assetData);
      await refreshAssets();
    } catch (err) {
      setError('Failed to add asset');
    }
  };

  const updateAsset = async (id, assetData) => {
    try {
      await assetService.updateAsset(id, assetData);
      await refreshAssets();
    } catch (err) {
      setError('Failed to update asset');
    }
  };

  const deleteAsset = async (id) => {
    try {
      await assetService.deleteAsset(id);
      await refreshAssets();
    } catch (err) {
      setError('Failed to delete asset');
    }
  };

  return (
    <AssetContext.Provider value={{
      assets,
      assetHistory,
      assetBatches,
      loading,
      error,
      refreshAssets,
      addNewAsset,
      updateAsset,
      deleteAsset,
    }}>
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = () => useContext(AssetContext);
