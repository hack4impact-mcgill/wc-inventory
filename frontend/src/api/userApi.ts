import { User } from './authApi';
import api from '../utils/axiosConfig';

export const fetchUsers = async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
};