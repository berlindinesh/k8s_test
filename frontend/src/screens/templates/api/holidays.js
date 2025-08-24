import api from "../../../api/axiosInstance";

const API_URL = "holidays";
// Fetch all holidays
export const fetchHolidays = () => api.get(API_URL);

// Create a new holiday
export const createHoliday = (holiday) => {
    // Ensure the payload aligns with the schema
    const { name, startDate, endDate, recurring } = holiday;
    return api.post(API_URL, { name, startDate, endDate, recurring });
};

// Update a holiday by ID
export const updateHoliday = (id, holiday) => {
    // Ensure the payload aligns with the schema
    const { name, startDate, endDate, recurring } = holiday;
    return api.put(`${API_URL}/${id}`, { name, startDate, endDate, recurring });
};

// Delete a holiday by ID
export const deleteHoliday = (id) => api.delete(`${API_URL}/${id}`);

// Fetch filtered holidays
export const fetchFilteredHolidays = (fromDate, toDate, recurring) => {
    const query = new URLSearchParams();
    if (fromDate) query.append('fromDate', fromDate);
    if (toDate) query.append('toDate', toDate);
    if (recurring !== undefined) query.append('recurring', recurring);
    return api.get(`${API_URL}/filter?${query.toString()}`);
};
