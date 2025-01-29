import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserFormData } from "../types";

export function useUserManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const createUserMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
      // Check if User exists
      //   const { data: userExists, error: checkError } = await supabase.rpc(
      //     "check_user_exists",
      //     { input_email: data.email }
      //   );

      //   if (checkError && checkError.code !== "PGRST116") {
      //     throw new Error(`Error checking existing user: ${checkError.message}`);
      //   }

      //   if (userExists) {
      //     throw new Error("A user with this email already exists.");
      //   }

      //   if (createError) {
      //     throw new Error(`Failed to create user: ${createError.message}`);
      //   }

      //   return newUser;
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsModalOpen(false);
    },
  });

  return {
    isModalOpen,
    setIsModalOpen,
    createUser: createUserMutation.mutate,
    isPending: createUserMutation.isPending,
    error: createUserMutation.error,
    isSuccess: createUserMutation.isSuccess,
  };
}
