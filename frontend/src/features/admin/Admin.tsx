import UserList from "./components/UserList";


export const Admin: React.FC = () => {
    return (
        <>
            <h1 className="text-2xl font-semibold text-primary">Admin</h1>
            <UserList />
        </>
    );
};

export default Admin;