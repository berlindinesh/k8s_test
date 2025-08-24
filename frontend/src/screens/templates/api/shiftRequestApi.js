import api from '../../../api/axiosInstance';

const API_URL = 'shift-requests';

export const fetchShiftRequests = () => api.get(API_URL);


export const createShiftRequest = (data) => {
    const formattedData = {
        ...data,
        requestedDate: new Date(data.requestedDate).toISOString(),
        requestedTill: new Date(data.requestedTill).toISOString()
    };
    return api.post(API_URL, formattedData);

};

export const updateShiftRequest = (id, data) => {
    const formattedData = {
        ...data,
        requestedDate: new Date(data.requestedDate).toISOString(),
        requestedTill: new Date(data.requestedTill).toISOString()
    };
    return api.put(`${API_URL}/${id}`, formattedData);

};

export const deleteShiftRequest = (id) => api.delete(`${API_URL}/${id}`);
export const approveShiftRequest = (id) => api.put(`${API_URL}/${id}/approve`);
export const rejectShiftRequest = (id) => api.put(`${API_URL}/${id}/reject`);
