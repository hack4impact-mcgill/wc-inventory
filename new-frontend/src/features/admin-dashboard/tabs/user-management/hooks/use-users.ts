import { userApi } from '@/lib/api/users';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useUsers() {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers
  });

  const createUserMutation = useMutation({
    mutationFn: userApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  return {
    users: usersQuery.data,
    isLoading: usersQuery.isLoading,
    error: usersQuery.error,
    createUser: createUserMutation.mutate,
    isCreating: createUserMutation.isPending
  };
}