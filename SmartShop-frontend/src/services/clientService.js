import api from './api';

export const clientService = {
    getCount: async () => {
        const response = await api.get('/clients/count');
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/clients');
        return response.data;
    },

    create: async (data) => {
        const response = await api.post('/clients', data);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/clients/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/clients/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/clients/${id}`);
        return response.data;
    },

    block: async (id) => {
        const response = await api.patch(`/clients/${id}/block`);
        return response.data;
    },

    unblock: async (id) => {
        const response = await api.patch(`/clients/${id}/unblock`);
        return response.data;
    },

    getOrderHistory: async (id) => {
        const response = await api.get(`/clients/${id}/orders`);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/clients/me');
        return response.data;
    }
};

export default clientService;
