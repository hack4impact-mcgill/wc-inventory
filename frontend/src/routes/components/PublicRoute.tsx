import { useLocation, Navigate } from "react-router-dom";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import PublicLayout from "../../components/layout/PublicLayout";
import { useAuth } from "../../contexts/AuthContext";


interface PublicRouteProps {
    element: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isAuthenticated && location.pathname === '/login') {
        return <Navigate to="/" replace />;
    }

    return <PublicLayout>{element}</PublicLayout>;
};