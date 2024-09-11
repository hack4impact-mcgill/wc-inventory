import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        login({ username, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p>Error: {error.message}</p>}
        </form>
    );
};