import { useMutation } from "@tanstack/react-query";
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
  note: string | undefined;
  onAddSuccess: () => void;
}

export const useSaveBox = ({
  items,
  boxCount,
  location,
  note,
  onAddSuccess
}: UseSaveBoxParams) => {
  return useMutation({
    mutationFn: async () => {      
      
      // First create the box
      const boxName = `Box ${String(boxCount).padStart(3, "0")}`;
      const currentUser = await supabase.auth.getUser();
      const userId = currentUser.data.user?.id;
      
      const { data: boxData, error: boxError } = await supabase
        .from("boxes")
        .insert({
          name: boxName,
          location_id: location.row || location.aisle || location.level || location.room,
          description: note || null,
        })
        .select()
        .single();

      if (boxError) {
        throw boxError;
      }

      // Then add contents
      const boxContents = items.map((item) => ({
        ...item,
        box_id: boxData.box_id,
      }));

      const { error: contentsError } = await supabase
        .from("box_contents")
        .insert(boxContents);

      if (contentsError) {
        throw contentsError;
      }

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
    },
    onSuccess: () => {
      onAddSuccess?.();
    },
    onError: (error) => {
    },
  });
};