import api from './api';

const companySettingsService = {
  // Get company settings
  getSettings: async () => {
    try {
      const response = await api.get('/companies/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching company settings:', error);
      throw error;
    }
  },
  
  // Update company settings
  updateSettings: async (settingsData) => {
    try {
      const response = await api.put('/companies/settings', settingsData);
      return response.data;
    } catch (error) {
      console.error('Error updating company settings:', error);
      throw error;
    }
  }
};

export default companySettingsService;
