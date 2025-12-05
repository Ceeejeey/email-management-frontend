import axios from 'axios';

// Create an instance of axios
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // use VITE_API_URL from .env
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the Firebase ID token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
