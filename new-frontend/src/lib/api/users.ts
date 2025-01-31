import { UserFormData } from "@/features/admin-dashboard/tabs/user-management/types";
import { UserView } from "@/types/user";
import { supabase } from "../supabaseClient";

export const userApi = {
    getUsers: async () => {
      const { data, error } = await supabase
        .from("user_view")
        .select()
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as UserView[];
    },
  
    createUser: async (userData: UserFormData) => {
      const { data: exists } = await supabase
        .rpc('check_user_exists', { input_email: userData.email });
      
      if (exists) {
        throw new Error('User already exists');
      }
  
      const { data, error } = await supabase
        .rpc('create_new_user', {
          email: userData.email,
          password: userData.password,
          role: userData.role,
          first_name: '', // Optional parameters
          last_name: ''
        });
  
      if (error) throw new Error(error.message);
      return data;
    }
  };