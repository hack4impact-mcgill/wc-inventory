import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useInventory } from "../../hooks/useInventory";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBoxDetails } from "../../hooks/useBoxDetails";
import BoxDetailsSlideOver from "./components/BoxDetailsSlideOver";

const Inventory = () => {
  const { data: inventory, isLoading, error } = useInventory();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );

  const [selectedItem, setSelectedItem] = useState<
    {
      categoryId: string;
      categoryName: string;
      sizeId: string | null;
      sizeName: string | null;
    } | null
  >(null);
  const { data: boxDetails, isLoading: boxDetailsLoading } = useBoxDetails(
    selectedItem?.categoryId || "",
    selectedItem?.sizeId || null,
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };
  const handleSizeClick = (
    categoryId: string,
    categoryName: string,
    sizeId: string | null,
    sizeName: string | null,
  ) => {
    setSelectedItem({ categoryId, categoryName, sizeId, sizeName });
  };

  const exportToCsv = () => {
    if (!inventory) return;

    const headers = "Category,Total Quantity\n";
    const rows = inventory
      .map((item) => `${item.category_name},${item.total_quantity}`)
      .join("\n");

    const csvContent = `data:text/csv;charset=utf-8,${headers + rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) return <div>Loading inventory...</div>;
  if (error) {
    return <div>Error loading inventory: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Inventory as of {new Date().toLocaleDateString()}
      </h1>
      <div className="flex gap-4 mb-6">
        <Button onClick={exportToCsv}>Export to CSV</Button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Category</TableHead>
              <TableHead className="font-bold">Total Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory?.map((item) => (
              <>
                <TableRow
                  key={item.category_id}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => toggleCategory(item.category_id)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expandedCategories.has(item.category_id)
                        ? <ChevronDown size={16} />
                        : <ChevronRight size={16} />}
                      {item.category_name}
                    </div>
                  </TableCell>
                  <TableCell>{item.total_quantity}</TableCell>
                </TableRow>
                {expandedCategories.has(item.category_id) &&
                  item.sizes.map((size) => (
                    <TableRow
                      key={`${item.category_id}-${size.size_id || "no-size"}`}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        handleSizeClick(
                          item.category_id,
                          item.category_name,
                          size.size_id,
                          size.size_name,
                        )}
                    >
                      <TableCell className="pl-8">{size.size_name}</TableCell>
                      <TableCell>{size.quantity}</TableCell>
                    </TableRow>
                  ))}
              </>
            ))}
          </TableBody>
        </Table>
      </Card>

      <BoxDetailsSlideOver
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        categoryName={selectedItem?.categoryName || ""}
        sizeName={selectedItem?.sizeName || null}
        boxDetails={boxDetails}
        isLoading={boxDetailsLoading}
      />
    </div>
  );
};

export default Inventory;
