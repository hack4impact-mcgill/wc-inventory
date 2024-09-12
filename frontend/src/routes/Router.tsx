import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Login } from '../features/Login/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import Admin from '../features/admin/Admin';
import Dashboard from '../features/dashboard/Dashboard';

export const Router: React.FC = () => {
    const { isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <Routes>
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
                path="/"
                element={
                    <ProtectedRoute
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <Dashboard />
                            </Suspense>
                        }
                        allowedRoles={['Volunteer', 'Coordinator', 'Admin']}
                    />
                }
            />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute
                        element={
                            <Suspense fallback={<LoadingSpinner />}>
                                <Admin />
                            </Suspense>
                        }
                        allowedRoles={['Admin']}
                    />
                }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};