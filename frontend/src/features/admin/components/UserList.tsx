import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useUsers } from "@/hooks/useUsers";


const UserList: React.FC = () => {
    const { data: users, isLoading, isError, error } = useUsers();

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <div>Error: {error?.message || 'An error occurred'}</div>;
    }

    if (!users || users.length === 0) {
        return <div>No users found.</div>;
    }

    return (
        <div className="paper">
            <h2 className="text-xl font-semibold mb-6 text-primary">User List</h2>
            <ul className="space-y-2">
                {users.map((user) => (
                    <li key={user.id}>
                        <span className="font-medium">{user.username}</span>
                        <span className="ml-2 text-sm text-gray-600">({user.role})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;