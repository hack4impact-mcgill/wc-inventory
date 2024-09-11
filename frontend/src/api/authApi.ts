// src/api/authApi.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers!.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>('/api/auth/login', credentials);
  return response.data;
};

export const fetchUserProfile = async (): Promise<User> => {
  const response = await axiosInstance.get<User>('/api/auth/profile');
  return response.data;
};

export { axiosInstance };