import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import AuthenticatedLayout from "../../components/layout/AuthenticatedLayout";
import { useAuth } from "../../contexts/AuthContext";


interface ProtectedRouteProps {
    element: React.ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, allowedRoles }) => {
    const { user, isLoading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        return <Navigate to="/forbidden" replace />;
    }

    const Layout = AuthenticatedLayout;

    return <Layout>{element}</Layout>;
};
