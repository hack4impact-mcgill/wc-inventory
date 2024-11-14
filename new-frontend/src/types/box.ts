import { Database } from "./supabase";

type BoxTable = Database["public"]["Tables"]["boxes"];

export type Box = BoxTable['Row'];