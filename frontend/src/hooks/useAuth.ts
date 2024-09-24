import { useState, useEffect, useCallback } from 'react';
import { refreshToken, logout, loginUser } from '../api/authApi';

export interface User {
    id: string;
    username: string;
    email: string;
    role: 'Volunteer' | 'Coordinator' | 'Admin';
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const login = useCallback(async (username: string, password: string) => {
        const user = await loginUser(username, password);
        setUser(user);
        return user;
    }, []);

    const logoutUser = useCallback(async () => {
        await logout();
        setUser(null);
    }, []);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const user = await refreshToken();
                setUser(user);
            } catch (error) {
                console.error('Failed to refresh token:', error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    return {
        user,
        login,
        logout: logoutUser,
        refreshToken,
        isLoading: loading,
        isAuthenticated: !!user,
    };
};