import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5102/api'; // Замініть на ваш URL з Program.cs

const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',

    },

});


apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        console.log('Starting Request:', config.method?.toUpperCase(), config.url, config.data);
        return config;
    },
    (error: AxiosError) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);


apiClient.interceptors.response.use(
    (response: AxiosResponse) => {

        console.log('Response Received', response);
        return response;
    },
    (error: AxiosError) => {
        console.error('Response Error Interceptor:', error.response || error.message);

        if (error.response) {

            const { status, data } = error.response;
            switch (status) {
                case 400:
                    console.error('Bad Request:', data);
                    break;
                case 401:
                    console.error('Unauthorized access - 401');
                    break;
                case 403:
                    console.error('Forbidden - 403');
                    break;
                case 404:
                    console.error('Resource not found - 404');
                    break;
                case 500:
                    console.error('Internal Server Error - 500');
                    break;
                default:
                    console.error(`Unhandled error status: ${status}`);
            }
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;