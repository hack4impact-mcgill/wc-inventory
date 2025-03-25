import { format } from 'date-fns';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UserView } from '@/types/user';

interface UserTableProps {
    users: UserView[];
    onUserClick: (userId: string) => void;
}

export function UserTable({ users, onUserClick }: UserTableProps) {
    if (!users.length) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                No users found
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Last Action</TableHead>
                    <TableHead>When</TableHead>
                    <TableHead>Date Created</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user) => (
                    <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => onUserClick(user.id!)}
                    >
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{user.created_at ? format(new Date(user.created_at), 'PP') : '-'}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}