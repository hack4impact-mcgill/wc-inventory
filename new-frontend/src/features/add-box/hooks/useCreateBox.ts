import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { BoxContent } from "@/types/boxContent";
import { Database } from "@/types/supabase";

//type BoxMovementAction = Database["public"]["Enums"]["box_movement_action"];

interface BoxLocation {
  room: string;
  level: string;
  aisle: string;
  row: string;
}

interface UseSaveBoxParams {
  items: BoxContent[];
  boxCount: number | undefined;
  location: BoxLocation;
  onAddSuccess: (data?: any) => void;
  boxId?: string | null; // For update mode
  isUpdateMode?: boolean;
  note: string | undefined;
  onAddSuccess: () => void;
}

export const useSaveBox = ({
  items,
  boxCount,
  location,
  note,
  onAddSuccess,
  boxId,
  isUpdateMode = false
}: UseSaveBoxParams) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (isUpdateMode && boxId) {
        // UPDATE MODE: Update existing box
        
        // Update box location if changed
        const { error: boxError } = await supabase
          .from("boxes")
          .update({
            location_id: location.row || location.aisle || location.level || location.room,
            updated_at: new Date().toISOString(),
          })
          .eq("box_id", boxId);

        if (boxError) throw boxError;

        // Delete all existing contents
        const { error: deleteError } = await supabase
          .from("box_contents")
          .delete()
          .eq("box_id", boxId);

        if (deleteError) throw deleteError;

        // Insert new contents
        if (items.length > 0) {
          const boxContents = items.map((item) => ({
            category_id: item.category_id,
            size_id: item.size_id,
            gender: item.gender,
            quantity: item.quantity,
            box_id: boxId,
          }));

          const { error: contentsError } = await supabase
            .from("box_contents")
            .insert(boxContents);

          if (contentsError) throw contentsError;
        }

        // Fetch and return updated box data
        const { data: updatedBox, error: fetchError } = await supabase
          .from("boxes")
          .select("*")
          .eq("box_id", boxId)
          .single();

        if (fetchError) throw fetchError;

        return updatedBox;
      } else {
        // CREATE MODE: Create new box
        const boxName = `Box ${String(boxCount).padStart(3, "0")}`;
        const { data: boxData, error: boxError } = await supabase
          .from("boxes")
          .insert({
            name: boxName,
            location_id: location.row || location.aisle || location.level || location.room,
            description: note || null,
          })
          .select()
          .single();

        if (boxError) throw boxError;

        // Then add contents
        const boxContents = items.map((item) => ({
          ...item,
          box_id: boxData.box_id,
        }));

        const { error: contentsError } = await supabase
          .from("box_contents")
          .insert(boxContents);

        if (contentsError) throw contentsError;

        // Finally, log the box movement
        const { error: movementError } = await supabase
          .from("box_movements")
          .insert({
            moved_by: userId || null,
            box_id: boxData.box_id,
            to_location_id: location.row || location.aisle || location.level || location.room,
            action: "Created",
            note: note || "Box created",
          });

        if (movementError) {
          throw movementError;
        }

        return boxData;
      }
    },
    onSuccess: (data) => {
      // Invalidate the boxes query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["boxCount"] });
      onAddSuccess?.(data);
    },
  });
};
