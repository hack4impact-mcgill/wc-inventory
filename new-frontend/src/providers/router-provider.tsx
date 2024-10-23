import { createBrowserRouter, Navigate } from "react-router-dom";
import Layout from "@/components/layout";
import Login from "@/features/auth/login";
import { useAuthContext } from "@/contexts/auth-context";
import LoadingScreen from "@/components/loading";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuthContext();
    if (!user && !isLoading) {
        return <Navigate to="/login" replace />;
    }
    if (isLoading) {
        return <LoadingScreen />
    }
    return (
        <Layout>
            {children}
        </Layout>
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
            <ProtectedRoute>
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-4">Welcome to Your App</h1>
                    <p className="text-lg">This is the home page of your application.</p>
                </div>
            </ProtectedRoute>
        ),
    },
    {
        path: "/login",
        element: <Login />,
    },
]);

export default router;