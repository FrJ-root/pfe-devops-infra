import api from './api';

export const authService = {
    login: async (username, password) => {
        try {
            console.log('Attempting login with username:', username);
            const response = await api.post('/auth/login', { username, password });
            console.log('Login response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error response:', error.response);
            throw error;
        }
    },

    logout: async () => {
        try {
            const response = await api.post('/auth/logout');
            return response.data;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
};
