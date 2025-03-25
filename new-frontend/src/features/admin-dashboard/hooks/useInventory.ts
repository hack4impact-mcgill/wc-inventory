import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface InventoryItem {
  category_id: string;
  category_name: string;
  total_quantity: number;
  sizes: {
    size_id: string | null;
    size_name: string | null;
    quantity: number;
  }[];
}

const fetchInventory = async (): Promise<InventoryItem[]> => {
  const { data, error } = await supabase
    .from("box_contents")
    .select(`
      category_id,
      quantity,
      size_id,
      categories (name),
      sizes (name)
    `)
    .returns<
      {
        category_id: string;
        quantity: number;
        size_id: string | null;
        categories: { name: string };
        sizes: { name: string } | null;
      }[]
    >();

  if (error) throw new Error(error.message);

  // Aggregate data by category
  const aggregatedData = data.reduce((acc, item) => {
    const categoryId = item.category_id;
    const categoryName = item.categories.name;
    const sizeId = item.size_id;
    const sizeName = item.sizes?.name || "No Size";
    const quantity = item.quantity;

    if (!acc[categoryId]) {
      acc[categoryId] = {
        category_id: categoryId,
        category_name: categoryName,
        total_quantity: 0,
        sizes: {},
      };
    }

    acc[categoryId].total_quantity += quantity;

    if (!acc[categoryId].sizes[sizeId || "no-size"]) {
      acc[categoryId].sizes[sizeId || "no-size"] = {
        size_id: sizeId,
        size_name: sizeName,
        quantity: 0,
      };
    }

    acc[categoryId].sizes[sizeId || "no-size"].quantity += quantity;

    return acc;
  }, {} as Record<string, {
    category_id: string;
    category_name: string;
    total_quantity: number;
    sizes: Record<
      string,
      { size_id: string | null; size_name: string | null; quantity: number }
    >;
  }>);

  // Convert to array format
  return Object.values(aggregatedData).map((item) => ({
    ...item,
    sizes: Object.values(item.sizes),
  }));
};

export const useInventory = () => {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: fetchInventory,
  });
};
