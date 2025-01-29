import React, { useEffect } from "react";
import { useUserManagement } from "./hooks/use-user-management";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserForm } from "./components/user-form";
import { Button } from "@/components/ui/button";

const UserManagement = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    createUser,
    isPending,
    error,
    isSuccess,
  } = useUserManagement();

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
    <div className="flex flex-col items-center justify-center h-[70vh]">
      <Button onClick={() => setIsModalOpen(true)}>Create User</Button>

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
