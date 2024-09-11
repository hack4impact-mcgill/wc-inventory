import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, LoginCredentials, loginUser, fetchUserProfile } from '../api/authApi';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const queryClient = useQueryClient();

    const { data: profileData, isLoading: isProfileLoading } = useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
        retry: false,
        enabled: !!localStorage.getItem('token'),
    });

    useEffect(() => {
        if (profileData) {
            setUser(profileData);
        }
    }, [profileData]);

    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token);
            setUser(data.user);
            queryClient.setQueryData(['userProfile'], data.user);
        },
    });

    const login = async (credentials: LoginCredentials) => {
        await loginMutation.mutateAsync(credentials);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        queryClient.clear();
    };

    const value = {
        user,
        isLoading: isProfileLoading,
        isAuthenticated: !!user,
        login,
        logout,
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
