import PublicLayout from "../../components/layout/PublicLayout";


interface PublicRouteProps {
    element: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {

    return <PublicLayout>{element}</PublicLayout>;
};