

interface PublicRouteProps {
    element: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ element }) => {

    return <>
        {element}
    </>;
};