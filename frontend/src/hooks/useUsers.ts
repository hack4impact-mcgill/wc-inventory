import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/userApi';
import { User } from '../api/authApi';

export const useUsers = () => {
  return useQuery<User[], Error>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
};