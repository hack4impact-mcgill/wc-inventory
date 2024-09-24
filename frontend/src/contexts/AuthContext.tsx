import React, { createContext, useContext } from 'react';
import { User } from '../api/authApi';
import { useAuth } from '../hooks/useAuth';

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<User>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const auth = useAuth();

    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthProvider, AuthContext, useAuthContext };
