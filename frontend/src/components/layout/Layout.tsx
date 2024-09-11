// src/components/layout/Layout.tsx
import React from 'react';
import { Routes, Route } from "react-router-dom";
import { Login } from "../../features/Login/Login";
import Dashboard from '../../features/dashboard/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import PublicRoute from './PublicRoute';

const Layout: React.FC = () => {
    return (
        <div >
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
            </Routes>
        </div>
    );
};

export default Layout;