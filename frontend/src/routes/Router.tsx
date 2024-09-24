import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Login } from '../features/Login/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import Admin from '../features/Admin/Admin';
import Dashboard from '../features/Dashboard/Dashboard';
import { useAuthContext } from '../contexts/AuthContext';

export const Router: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuthContext();

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