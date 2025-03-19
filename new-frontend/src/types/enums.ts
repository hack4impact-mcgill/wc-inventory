import { Database } from "./supabase";

export type GenderEnum = Database["public"]["Enums"]["gender_enum"];
export type SizeCategoryEnum = Database["public"]["Enums"]["size_category_enum"];
export type BoxStatusEnum = Database["public"]["Enums"]["box_status_enum"];