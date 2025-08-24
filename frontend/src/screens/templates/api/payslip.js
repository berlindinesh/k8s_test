import api from '../../../api/axiosInstance';

const API_URL = 'payslips';

const axiosInstance = axios.create({
    baseURL: 'payslips',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const payslipAPI = {
    getAllPayslips: async (page = 1, limit = 10, filters = {}) => {
        const queryParams = new URLSearchParams({ page, limit, ...filters });
        // const response = await axiosInstance.get(`?${queryParams}`);
        const response = await api.get(`payslips?${queryParams}`);
        return response.data;
    },

    createPayslip: async (payslipData) => {
        // const response = await axiosInstance.post('', payslipData);
        const response = await api.post('payslips', payslipData);
        return response.data;
    },

    updatePayslip: async (id, payslipData) => {
        // const response = await axiosInstance.put(`/${id}`, payslipData);
        const response = await api.put(`payslips/${id}`, payslipData);
        return response.data;
    },

    deletePayslip: async (id) => {
        const response = await api.delete(`payslips/${id}`);
        return response.data;
    },

    bulkDeletePayslips: async (ids) => {
        const response = await api.post('payslips/bulk-delete', { ids });
        return response.data;
    },

    updateMailStatus: async (id) => {
        const response = await api.put(`payslips/${id}/mail-status`, {});
        return response.data;
    },

    getPayslipById: async (id) => {
        const response = await api.get(`payslips/${id}`);
        return response.data;
    },

    exportPayslips: async (filters = {}) => {
        const queryParams = new URLSearchParams(filters);
        const response = await api.get(`payslips/export?${queryParams}`, {
            responseType: 'blob'
        });
        return response.data;
    }
};

export default payslipAPI;
