import { Database } from "./supabase";

type BoxMovementsTable = Database["public"]["Tables"]["box_movements"];

export type BoxMovement = BoxMovementsTable["Row"];