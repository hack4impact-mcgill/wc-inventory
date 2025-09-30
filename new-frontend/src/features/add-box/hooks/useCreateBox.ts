import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { BoxContent } from "@/types/boxContent";

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
  onAddSuccess: () => void;
}

export const useSaveBox = ({
  items,
  boxCount,
  location,
  onAddSuccess
}: UseSaveBoxParams) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // First create the box
      const boxName = `Box ${String(boxCount).padStart(3, "0")}`;
      const { data: boxData, error: boxError } = await supabase
        .from("boxes")
        .insert({
          name: boxName,
          location_id: location.row || location.aisle || location.level || location.room,
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

      return boxData;
    },
    onSuccess: () => {
      // Invalidate the boxes query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      queryClient.invalidateQueries({ queryKey: ["boxCount"] });
      onAddSuccess?.();
    },
  });
};
