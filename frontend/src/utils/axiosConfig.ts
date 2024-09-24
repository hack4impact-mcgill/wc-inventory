import axios from 'axios';
import { refreshToken } from '../api/authApi';

const api = axios.create({
    baseURL: '/api',
    withCredentials: true,
});

const isAuthEndpoint = (url: string): boolean => {
    const authEndpoints = ['auth/login', 'auth/logout', 'auth/refresh'];
    return authEndpoints.some(endpoint => url.includes(endpoint));
};

export const setAccessToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (!originalRequest) {
            return Promise.reject(error);
        }
        
        if (error.response?.status === 401 && !isAuthEndpoint(originalRequest.url || '') && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await refreshToken();
                return api(originalRequest);
            } catch (refreshError) {
                console.error('Token refresh failed:', refreshError);
                setAccessToken(null);
                // TODO - > Redirect needed?
            }
        }
        return Promise.reject(error);
    }
);

export default api;