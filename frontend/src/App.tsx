import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { LoginForm, useAuth } from "./features/auth";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome to the protected dashboard!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

const AppContent: React.FC = () => {
  return (
    <div className="App">
      <h1>Welcome to the App</h1>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;