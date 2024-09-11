import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login as loginApi, LoginCredentials, LoginResponse } from '../api/authApi';
import { useNavigate, useLocation } from 'react-router-dom';

export const useAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();

    const loginMutation = useMutation<LoginResponse, Error, LoginCredentials>({
        mutationFn: (credentials: LoginCredentials) => loginApi(credentials),
        onSuccess: (data: LoginResponse) => {
            localStorage.setItem('token', data.token);
            queryClient.setQueryData(['user'], { isAuthenticated: true });

            const origin = (location.state as any)?.from?.pathname || '/';
            navigate(origin);
        },
    });

    const logout = () => {
        localStorage.removeItem('token');
        queryClient.setQueryData(['user'], { isAuthenticated: false });
        navigate('/login');
    };

    return {
        login: loginMutation.mutate,
        logout,
        isLoading: loginMutation.isPending,
        error: loginMutation.error,
    };
};