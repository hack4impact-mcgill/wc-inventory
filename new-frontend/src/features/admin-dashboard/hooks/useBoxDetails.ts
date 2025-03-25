import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export interface BoxDetail {
  box_id: string;
  box_name: string;
  location_name: string;
  quantity: number;
}

const fetchBoxDetails = async (
  categoryId: string,
  sizeId: string | null,
): Promise<BoxDetail[]> => {
  const query = supabase
    .from("box_contents")
    .select(`
      box_id,
      quantity,
      boxes (
        name,
        location_id,
        locations (name)
      )
    `)
    .eq("category_id", categoryId);

  if (sizeId) {
    query.eq("size_id", sizeId);
  } else {
    query.is("size_id", null);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);

  return data.map((item) => ({
    box_id: item.box_id,
    box_name: item.boxes.name,
    location_name: item.boxes.locations.name,
    quantity: item.quantity,
  }));
};

export const useBoxDetails = (categoryId: string, sizeId: string | null) => {
  return useQuery({
    queryKey: ["boxDetails", categoryId, sizeId],
    queryFn: () => fetchBoxDetails(categoryId, sizeId),
    enabled: !!categoryId,
  });
};
