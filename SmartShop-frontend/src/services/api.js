import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: true, // Crucial for HTTP Session authentication
});

// Helper for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    console.error('Error config:', error.config);
    console.error('Error response:', error.response);

    const message = error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    console.error(`Error ${error.response?.status}: ${message}`);
    return Promise.reject(error);
  }
);

export default api;