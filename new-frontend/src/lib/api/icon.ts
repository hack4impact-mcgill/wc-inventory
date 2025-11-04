

//For when DB added
import { supabase } from "../supabaseClient";


export interface CategoryIcon {
  icon_id: string;
  name: string;
  data: string | null; 
  mime_type: string | null;
  uploaded_by: string | null;
  created_at: string;
}

export type CategoryIconInsert = Omit<CategoryIcon, "icon_id" | "created_at">;
export type CategoryIconUpdate = Partial<
  Omit<CategoryIcon, "icon_id" | "created_at">
>;

export const iconApi = {
  getIcons: async () => {
    const { data, error } = await supabase
      .from("category_icons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data as CategoryIcon[];
  },

  getIconById: async (id: string) => {
    const { data, error } = await supabase
      .from("category_icons")
      .select("*")
      .eq("icon_id", id)
      .single();

    if (error) throw new Error(error.message);
    return data as CategoryIcon;
  },

  createIcon: async (newIcon: CategoryIconInsert) => {
    const { data, error } = await supabase
      .from("category_icons")
      .insert(newIcon)
      .select("*")
      .single();

    if (error) throw error;
    return data as CategoryIcon;
  },

  updateIcon: async (id: string, updatedIcon: CategoryIconUpdate) => {
    const { data, error } = await supabase
      .from("category_icons")
      .update(updatedIcon)
      .eq("icon_id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data as CategoryIcon;
  },

  deleteIcon: async (id: string) => {
    const { error } = await supabase
      .from("category_icons")
      .delete()
      .eq("icon_id", id);

    if (error) throw error;
  },
};
