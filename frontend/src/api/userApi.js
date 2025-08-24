import api from '../services/api';

const userApi = {
  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.post('/companies/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await api.get('/api/users/profile');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    try {
      const response = await api.put('/api/users/profile', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default userApi;