import React from 'react';
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface User {
  username: string;
  lastAction: string;
  when: string;
  dateCreated: string;
}

const sampleUsers: User[] = [
  {
    username: "sarah.johnson",
    lastAction: "Updated profile",
    when: "10 minutes ago",
    dateCreated: "2024-01-15",
  },
  {
    username: "mike.smith",
    lastAction: "Created new project",
    when: "2 hours ago",
    dateCreated: "2023-12-01",
  },
  {
    username: "alex.wong",
    lastAction: "Added team member",
    when: "Yesterday",
    dateCreated: "2024-01-02",
  },
  {
    username: "lisa.patel",
    lastAction: "Generated report",
    when: "2 days ago",
    dateCreated: "2023-11-15",
  },
  {
    username: "david.brown",
    lastAction: "Modified permissions",
    when: "1 week ago",
    dateCreated: "2023-10-20",
  },
  {
    username: "emma.davis",
    lastAction: "Logged in",
    when: "Just now",
    dateCreated: "2024-01-28",
  }
];

const ManageStaff = () => {
  const [users, setUsers] = React.useState<User[]>(sampleUsers);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-2xl font-bold">Manage Staff</CardTitle>
        <div className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search user"
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <Button variant="outline" size="icon" className="h-8 w-8">
            +
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Last Action</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Date Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow 
                key={index}
                className="cursor-pointer hover:bg-muted"
                onClick={() => {
                  console.log("Clicked user:", user.username);
                }}
              >
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.lastAction}</TableCell>
                <TableCell>{user.when}</TableCell>
                <TableCell>{user.dateCreated}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ManageStaff;