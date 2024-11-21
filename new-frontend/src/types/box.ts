import { Database } from "./supabase";

type BoxTable = Database["public"]["Tables"]["boxes"];
type BoxViewTable = Database["public"]["Views"]["box_table"];
export type BoxView = BoxViewTable["Row"];
export type Box = BoxTable['Row'];