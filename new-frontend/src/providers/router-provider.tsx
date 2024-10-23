import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/layout";
import { useAuthContext } from "@/contexts/auth-context";
import LoadingScreen from "@/components/loading";
import LoginPage from "@/features/auth/login";
import AdminDashboard from "@/features/admin-dashboard";
import VolunteerDashboard from "@/features/volunteer-dashboard";
import CategoryManagement from "@/features/admin-dashboard/tabs/category-management";
import LocationManagement from "@/features/admin-dashboard/tabs/location-management";
import UserManagement from "@/features/admin-dashboard/tabs/user-management";
// import UserManagement from "@/features/admin-dashboard/tabs/user-management";

interface ProtectedRouteProps {
    children?: React.ReactNode;
    roles?: string[];
}

const AuthWrapper = ({ children, roles }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuthContext();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && !roles.includes(user.role!)) {
        // RBAC check -- uncomment when fixed
        // return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const VolunteerWrapper = ({ children }: ProtectedRouteProps) => {
    return (
        <AuthWrapper>
            <Layout>
                {children}
            </Layout>
        </AuthWrapper>
    );
};

const AdminWrapper = ({ children }: ProtectedRouteProps) => {
    return (
        <AuthWrapper roles={['Admin']}>
            {children}
        </AuthWrapper>
    );
};

// interface Route {
//     name: string;
//     href: string;
//     icon: Icon;
// }

// export const Routes: Route[] = [
//     {
//         name: "Home",
//         href: "/",
//         icon: Icons.home,
//     },
//     {
//         name: "Groceries",
//         href: "/groceries",
//         icon: Icons.groceries,
//     },
//     {
//         name: "Budgets",
//         href: "/budgets",
//         icon: Icons.budget,
//     },
//     {
//         name: "Literature",
//         href: "/literature",
//         icon: Icons.literature,
//     },
//     {
//         name: "Account",
//         href: "/account",
//         icon: Icons.user,
//     },
// ]
const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <VolunteerWrapper>
                <VolunteerDashboard />
            </VolunteerWrapper>
        ),
    },
    {
        path: "/admin",
        element: (
            <AdminWrapper>
                <AdminDashboard />
            </AdminWrapper>
        ),
        children: [
            {
                index: true,
                element: <div>Welcome to the Admin Overview</div>,
            },
            {
                path: "users",
                element: <UserManagement />,
            },
            {
                path: "locations",
                element: <LocationManagement />,
            },
            {
                path: "categories",
                element: <CategoryManagement />,
            }
        ],
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "*",
        element: <Navigate to="/" replace />,
    }
]);

export default router;