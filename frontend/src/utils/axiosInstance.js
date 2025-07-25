import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 80000, // Set a timeout of 80 seconds
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('token');
        if (accessToken) {
            config.headers.Authorization= `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

// response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if(error.response){
            if (error.response.status === 401) {
                // Handle unauthorized access, e.g., redirect to login
                console.error('Unauthorized access - redirecting to login');
                window.location.href = '/'; // Adjust the path as needed
            } 
            else if (error.response.status === 500) {
                console.error("Request timeout. please try again");
            }
            return Promise.reject(error);
        }
    }
);

export default axiosInstance;