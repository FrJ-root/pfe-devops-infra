import api from './api';

export const orderService = {
    // Get all orders (filtered by client on backend if CLIENT role)
    getAll: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    // Get single order details
    getById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    // Create a new order
    create: async (data) => {
        const response = await api.post('/orders', data);
        return response.data;
    },

    // Update order status (Admin only)
    updateStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}/status?status=${status}`);
        return response.data;
    }
};

export default orderService;
