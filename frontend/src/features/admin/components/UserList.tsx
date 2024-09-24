import { List, ListItem, Typography } from "@mui/material";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import { useUsers } from "../../../hooks/useUsers";


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
        <>
            <Typography variant="h6">User List</Typography>
            <List>
                {users!.map((user) => (
                    <ListItem key={user.id}>{user.username}</ListItem>
                ))}
            </List>
        </>
    );
};

export default UserList;