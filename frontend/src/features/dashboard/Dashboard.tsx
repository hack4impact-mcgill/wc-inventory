import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Welcome, {user?.username}!</h1>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>
        </div>

    );
};

export default Dashboard;