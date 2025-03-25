import { supabase } from "@/lib/supabaseClient";
import { GenderEnum } from "@/types/enums";
import { useQuery } from "@tanstack/react-query";

interface RawBoxDetail {
  box_id: string;
  gender: GenderEnum;
  quantity: number;
  boxes: {
    name: string;
    location_id: string | null;
    locations: {
      name: string;
    };
  };
}

export interface BoxDetail {
  box_id: string;
  box_name: string;
  location_name: string;
  gender: string;
  quantity: number;
}

const fetchBoxDetails = async (
  categoryId: string,
  sizeId: string | null,
  gender: GenderEnum | null,
): Promise<BoxDetail[]> => {
  console.log(categoryId);
  console.log(sizeId);
  console.log(gender);
  const query = supabase
    .from("box_contents")
    .select(`
      box_id,
      gender,
      quantity,
      boxes (
        name,
        location_id,
        locations (name)
      )
    `)
    .eq("category_id", categoryId);

  if (gender) query.eq("gender", gender);

  if (sizeId) {
    query.eq("size_id", sizeId);
  } else {
    query.is("size_id", null);
  }

  console.log(query);

  const { data, error } = await query.returns<RawBoxDetail[]>();

  if (error) throw new Error(error.message);
  if (!data) return [];

  return data.map((item: RawBoxDetail) => ({
    box_id: item.box_id,
    box_name: item.boxes.name,
    location_name: item.boxes.locations.name,
    gender: item.gender,
    quantity: item.quantity,
  }));
};

export const useBoxDetails = (
  categoryId: string,
  sizeId: string | null,
  gender: GenderEnum | null,
) => {
  return useQuery({
    queryKey: ["boxDetails", categoryId, sizeId, gender],
    queryFn: () => fetchBoxDetails(categoryId, sizeId, gender),
    enabled: !!categoryId,
  });
};
