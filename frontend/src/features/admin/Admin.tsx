import { Typography } from "@mui/material";
import { UserList } from "./components/UserList";


export const Admin: React.FC = () => {
    return (
        <>
            <Typography variant="h4">Admin</Typography>
            <UserList />
        </>
    );
};

export default Admin;