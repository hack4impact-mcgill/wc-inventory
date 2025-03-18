import { Box } from "@/types/box";
import { supabase } from "../supabaseClient";

export const boxApi = {
  getBoxes: async () => {
    const { data, error } = await supabase
      .from("boxes_view")
      .select()
      .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Box[];
  },

  getBox: async (boxId: string) => {
    const { data, error } = await supabase
      .from("boxes_view")
      .select()
      .eq("id", boxId)
      .single();

    if (error) throw new Error(error.message);
    return data as Box;
  },

  getBoxContents: async (boxId: string) => {
    const { data, error } = await supabase
      .from("box_contents_view")
      .select()
      .eq("box_id", boxId);

    if (error) throw new Error(error.message);
    return data;
  },

  moveBoxes: async (boxIds: string[], locationId: string) => {
    const { data, error } = await supabase
      .rpc('move_boxes', {
        p_box_ids: boxIds,
        p_location_id: locationId
      });

    if (error) throw new Error(error.message);
    return data;
  },

  donateBoxes: async (boxIds: string[]) => {
    // Assume there's a donated location id or a specific RPC for donations
    const { data, error } = await supabase
      .rpc('donate_boxes', {
        p_box_ids: boxIds
      });

    if (error) throw new Error(error.message);
    return data;
  }
};
