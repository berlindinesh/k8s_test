import api from '../api/axiosInstance';

// Update the API_URL to include 'timesheet'
const API_URL = 'timesheet';

export const timesheetService = {
  checkIn: (employeeId, employeeName) => {
    return api.post(`${API_URL}/check-in`, { employeeId, employeeName });
  },

  // Add force check-in method
  forceCheckIn: (employeeId, employeeName, token) => {
    return api.post(`${API_URL}/force-check-in`, { employeeId, employeeName });
  },
 
  checkOut: (employeeId, duration) => {
    return api.post(`${API_URL}/check-out`, { employeeId, duration });
  },
 
  getTodayTimesheet: (employeeId) => {
    return api.get(`${API_URL}/today?employeeId=${employeeId}`);
  },
 
  getWeeklyTimesheets: (employeeId) => {
    return api.get(`${API_URL}/weekly?employeeId=${employeeId}`);
  },
 
  getAllTimesheets: () => {
    return api.get(`${API_URL}`);
  },
 
  getTimesheetById: (id) => {
    return api.get(`${API_URL}/${id}`);
  },
 
  updateTimesheet: (id, data) => {
    return api.put(`${API_URL}/${id}`, data);
  },
 
  deleteTimesheet: (id) => {
    return api.delete(`${API_URL}/${id}`);
  },
  
  getTimesheetsByDateRange: (employeeId, startDate, endDate) => {
    return api.get(
      `${API_URL}/date-range?employeeId=${employeeId}&startDate=${startDate}&endDate=${endDate}`
    );
  }
};

