import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, credentials);
    return response.data;
};