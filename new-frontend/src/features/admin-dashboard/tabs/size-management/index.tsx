import { supabase } from "@/lib/supabaseClient";
import { Size } from "@/types/sizes";
import { useQuery } from "@tanstack/react-query";

const SizeManagement = () => {

  const { data } = useQuery({
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sizes")
        .select()
      if (error) throw new Error(error.message);

      return data as Size[];
    },
    queryKey: ["sizes"]
  })
  console.log(data);

  return (
    <>
      <h1>WCINV-87 Tech leads</h1>
      <text>Where admin can manage sizes available for each category</text>
    </>
  )

};

export default SizeManagement;
