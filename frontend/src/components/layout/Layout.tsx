import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Login } from "../../features/Login/Login";
import Dashboard from '../../features/dashboard/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import PublicRoute from './PublicRoute';
import { Box } from '@mui/material';

const Layout: React.FC = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* Add more protected routes here */}
            </Routes>
        </Box>
    );
};

export default Layout;