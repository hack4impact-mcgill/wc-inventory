import React from 'react';
import { useAuthContext } from '../../contexts/AuthContext';

export const Dashboard: React.FC = () => {
    const { user } = useAuthContext();

    return (
        <>
            <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
            <div className="paper">
                <p className="text-lg text-primary">Welcome, {user?.username}!</p>
                <p className="text-sm text-primary">Email: {user?.email}</p>
                <p className="text-sm text-primary">Role: {user?.role}</p>
            </div>
        </>
    );
};

export default Dashboard;