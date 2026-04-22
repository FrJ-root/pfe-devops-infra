import api from './api';

export const paymentService = {
    // Record a new payment (Admin only)
    recordPayment: async (data) => {
        const response = await api.post('/payments', data);
        return response.data;
    },

    // Get payments for a specific order
    getPaymentsByOrder: async (orderId) => {
        const response = await api.get(`/payments/order/${orderId}`);
        return response.data;
    },

    // Alias for compatibility
    getByOrderId: async (orderId) => {
        const response = await api.get(`/payments/order/${orderId}`);
        return response.data;
    }
};

export default paymentService;
