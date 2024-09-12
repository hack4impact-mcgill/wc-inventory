import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, LoginCredentials, loginUser, fetchUserProfile } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    refreshUser: () => Promise<void>;
    error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const queryClient = useQueryClient();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
        const token = localStorage.getItem('token');
        return !!token && !isTokenExpired(token);
    });

    const {
        data: user,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
        retry: false,
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && !isTokenExpired(token)) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            setIsAuthenticated(true);
            queryClient.setQueryData(['userProfile'], data.user);
        },
        onError: (error) => {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
        },
    });

    const login = useCallback(async (credentials: LoginCredentials) => {
        await loginMutation.mutateAsync(credentials);
    }, [loginMutation]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        queryClient.setQueryData(['userProfile'], null);
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    }, [queryClient]);

    const refreshUser = useCallback(async () => {
        if (isAuthenticated) {
            await refetch();
        }
    }, [isAuthenticated, refetch]);

    const value = {
        user: user ?? null,
        isLoading,
        isAuthenticated,
        login,
        logout: handleLogout,
        refreshUser,
        error: error as Error | null,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

const isTokenExpired = (token: string): boolean => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp < Date.now() / 1000;
    } catch {
        return true;
    }
};