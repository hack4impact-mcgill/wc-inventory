import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserView } from "@/types/user";

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
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Last Action</TableHead>
          <TableHead>When</TableHead>
          <TableHead>Account Creation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.id}
            className="cursor-pointer hover:bg-muted"
            onClick={() => onUserClick(user.email!)}
          >
            <TableCell>{user.name ?? "N/A"}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role}</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>
              {user.created_at ? format(new Date(user.created_at), "PP") : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
