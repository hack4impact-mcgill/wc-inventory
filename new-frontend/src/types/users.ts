import { Database } from "@/types/supabase";

type UserTable = Database["public"]["Tables"]["users"];

export type User = UserTable["Row"];
export type UserInsert = UserTable["Insert"];
export type UserUpdate = UserTable["Update"];
