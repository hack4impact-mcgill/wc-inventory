import React, { useEffect } from "react";
import { useUserManagement } from "./hooks/use-user-management";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./components/user-form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { TableHeader, Table, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Search } from "lucide-react";
import { UserView } from "@/types/user";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    isModalOpen,
    setIsModalOpen,
    createUser,
    isPending,
    isSuccess,
  } = useUserManagement();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await supabase.from("user_view").select()
      return (data.data as any) as UserView[];
    }
  });

  const filteredUsers = users?.filter(user =>
    user.email!.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
      });
    }
    if (isSuccess) {
      toast({
        title: "Success",
        description: "User created successfully",
      });
    }
  }, [error, isSuccess, toast]);

  return (
    <div className="">

      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold">Manage Staff</CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(new Date(), 'PPp')} {/* Better date formatting */}
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
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Create User
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username / Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Action</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Date Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(filteredUsers || []).map((user) => (
                <TableRow
                  key={user.id} // Use user.id instead of index
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => navigate(`/admin/users/${user.id}`)}
                >
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>TODO</TableCell>
                  <TableCell>TODO</TableCell>
                  <TableCell>{format(new Date(user.created_at!), 'PP')}</TableCell>
                </TableRow>
              ))}
              {filteredUsers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
          </DialogHeader>
          <UserForm
            onSubmit={createUser}
            onCancel={() => setIsModalOpen(false)}
            isLoading={isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
