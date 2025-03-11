import { fetchLocations, fetchCategories } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { sizeApi, sizeApiKeys } from "@/lib/api/sizes";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function useAddBoxQueries() {

  const { data: locations } = useQuery({
    queryFn: fetchLocations,
    queryKey: queryKeys.locations.all,
  });

  const { data: categories } = useQuery({
    queryFn: fetchCategories,
    queryKey: queryKeys.categories.all,
  });

  const { data: sizes } = useQuery({
    queryFn: sizeApi.getSizes,
    queryKey: sizeApiKeys.all
  })

  const { data: boxCount } = useQuery({
    queryFn: async () => {
      const { count } = await supabase
        .from("boxes")
        .select("*", { count: "exact", head: true });
      return (count || 0) + 1;
    },
    queryKey: ["boxCount"],
  });

  return {
    locations,
    sizes,
    categories,
    boxCount,
  }

}
