
import { Tables } from "./supabase";

export type BoxMovement = Tables['box_movements']['Row'];
export type BoxMovementInsert = Tables['box_movements']['Insert'];
export type BoxMovementUpdate = Tables['box_movements']['Update'];