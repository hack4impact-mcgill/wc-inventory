import { Database } from "./supabase";

type BoxTable = Database['public']['Tables']['boxes'];

export type Box = BoxTable['Row'];

export type BoxInsert = BoxTable['Insert'];

export type BoxUpdate = BoxTable['Update'];