import { axiosInstance, User } from './authApi';

export const fetchUsers = async (): Promise<User[]> => {
    const response = await axiosInstance.get<User[]>('/api/users');
    return response.data;
};