import api, { setAccessToken } from '../utils/axiosConfig';
import { jwtDecode } from 'jwt-decode';

export type UserRole = 'Volunteer' | 'Coordinator' | 'Admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RefreshResponse {
  message: string;
  token: string
}

export interface DecodedToken {
  userId: string;
  username: string;
  email: string;
  role: UserRole;
  exp: number;
}

const getUserFromToken = (token: string): User => {
  const decoded = jwtDecode<DecodedToken>(token);
  const user: User = {
    id: decoded.userId,
    username: decoded.username,
    email: decoded.email,
    role: decoded.role,
  };
  return user;
};


export const loginUser = async (username: string, password: string): Promise<User> => {
  const credentials: LoginCredentials = { username, password };
  const response = await api.post<LoginResponse>('auth/login', credentials);
  const user = getUserFromToken(response.data.token);
  setAccessToken(response.data.token);
  return user;
};

export const logout = async (): Promise<void> => {
  await api.post('auth/logout');
  setAccessToken(null);
};

export const fetchUserProfile = async (): Promise<User> => {
  const response = await api.get<User>('auth/profile');
  return response.data;
};

export const refreshToken = async (): Promise<User> => {
  const response = await api.post<RefreshResponse>('auth/refresh');
  const user = getUserFromToken(response.data.token);
  setAccessToken(response.data.token);
  return user;
};