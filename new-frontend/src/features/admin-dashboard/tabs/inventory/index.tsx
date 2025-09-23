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
import { GenderEnum } from "@/types/enums";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const Inventory = () => {
  const { data: inventory, isLoading, error } = useInventory();

  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [currentDate, setCurrentDate] = useState<Dayjs | null>(dayjs());

  const [expandedGenders, setExpandedGenders] = useState<Set<string>>(
    new Set(),
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [selectedItem, setSelectedItem] = useState<
    {
      categoryId: string;
      categoryName: string;
      sizeId: string | null;
      sizeName: string | null;
      gender: GenderEnum | null;
    } | null
  >(null);

  const { data: boxDetails, isLoading: boxDetailsLoading } = useBoxDetails(
    selectedItem?.categoryId ?? "",
    selectedItem?.sizeId ?? null,
    selectedItem?.gender ?? null,
    { enabled: !!selectedItem },
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
  const toggleGender = (categoryId: string, gender: string) => {
    const key = `${categoryId}-${gender}`;
    setExpandedGenders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id); //deselect item
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSizeClick = (
    categoryId: string,
    categoryName: string,
    sizeId: string | null,
    sizeName: string | null,
    gender: GenderEnum | null,
  ) => {
    setSelectedItem({ categoryId, categoryName, sizeId, sizeName, gender });
  };

  const exportToCsv = () => {
    if (!inventory) return;

    const headers = "Category,Gender,Size,Total Quantity\n";

    
    const rows = [];
    for (const category of inventory) {
        rows.push(`${category.category_name},,,${getAmount(category.items)}`); // Category total
      for (const gender of category.genders) {
        rows.push(` , ${gender.gender} ,, ${gender.sizes.flatMap((size) => size.items).length}  `) //gender total
        for (const size of gender.sizes) {
          for(const item of size.items){
            rows.push(`,,${size.size_name},${item.quantity}`);
          }
        }
      }
    }

    const csvContent = `data:text/csv;charset=utf-8,${headers + rows.join("\n")}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getAmount = (
    items: { createdAt: string; donatedAt: string; quantity: number }[],
  ) => {
    return items.map((item) => item.quantity).reduce((a, b) => a + b, 0);
  };

  const getRefills = (
    items: { createdAt: string; donatedAt: string; quantity: number }[],
    date: Dayjs | null,
  ) => {
    if (!date) return 0;
    const dateString = date.startOf("day").toISOString().split("T")[0]; // "YYYY-MM-DD"
    return items
      .filter((item) => {
        const createdDate =
          dayjs(item.createdAt).startOf("day").toISOString().split("T")[0];
        return createdDate === dateString;
      })
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const getDistributions = (
    items: { createdAt: string; donatedAt: string; quantity: number }[],
    date: Dayjs | null,
  ) => {
    if (!date) return 0;
    const dateString = date.startOf("day").toISOString().split("T")[0];
    return items
      .filter((item) =>
        item.donatedAt &&
        dayjs(item.donatedAt).startOf("day").toISOString().split("T")[0] ===
          dateString
      )
      .reduce((sum, item) => sum + item.quantity, 0);
  };
  if (isLoading) return <div>Loading inventory...</div>;
  if (error) {
    return <div>Error loading inventory: {(error as Error).message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={currentDate}
            onChange={(val) => setCurrentDate(val)}
            slotProps={{
              textField: {
                InputProps: {
                  sx: {
                    height: "40px",
                    pl: "5px",
                    backgroundColor: "transparent",
                  },
                },
                sx: {
                  width: "15rem",
                  height: "41px",
                  borderRadius: "0.3rem",
                  border: "1px solid #e0e0e0",
                  backgroundColor: "white",

                  // 💡 Style the input text when NOT focused and when focused
                  "& .MuiInputBase-input": {
                    color: "#000", // Make the input text black
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    fontFamily: "Poppins",
                  },

                  // 💡 Style the placeholder text
                  "& .MuiInputBase-input::placeholder": {
                    color: "#000", // Force black placeholder
                    opacity: 1, // Required to make the color show
                  },

                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                    "& fieldset": { border: "none" },
                    "&:hover fieldset": { border: "none" },
                    "&.Mui-focused fieldset": { border: "none" },
                  },
                },
              },
            }}
          />
        </LocalizationProvider>
        <Button 
          onClick={exportToCsv}
          className="h-[39px]"
        >
          Export to CSV
          </Button>
      </div>

      <Card className="mt-6 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Items</TableHead>
              <TableHead className="font-bold">Current Inventory</TableHead>
              <TableHead className="font-bold">Refills</TableHead>
              <TableHead className="font-bold">Distributions</TableHead>
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
                  <TableCell>{getAmount(item.items)}</TableCell>
                  <TableCell>{getRefills(item.items, currentDate)}</TableCell>
                  <TableCell>
                    {getDistributions(item.items, currentDate)}
                  </TableCell>
                </TableRow>
                {expandedCategories.has(item.category_id) &&
                  item.genders.map((genderItem) => (
                    <>
                      <TableRow
                        key={`${item.category_id}-${genderItem.gender}`}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          toggleGender(item.category_id, genderItem.gender)}
                      >
                        <TableCell className="pl-8">
                          <div className="flex items-center gap-2">
                            {expandedGenders.has(
                                `${item.category_id}-${genderItem.gender}`,
                              )
                              ? <ChevronDown size={16} />
                              : <ChevronRight size={16} />}
                            {genderItem.gender}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getAmount(
                            genderItem.sizes.flatMap((size) => size.items),
                          )}
                        </TableCell>
                        <TableCell>
                          {getRefills(
                            genderItem.sizes.flatMap((size) => size.items),
                            currentDate,
                          )}
                        </TableCell>
                        <TableCell>
                          {getDistributions(
                            genderItem.sizes.flatMap((size) => size.items),
                            currentDate,
                          )}
                        </TableCell>
                      </TableRow>
                      {expandedGenders.has(
                        `${item.category_id}-${genderItem.gender}`,
                      ) &&
                        genderItem.sizes.map((size) => (
                          <TableRow
                            key={`${item.category_id}-${genderItem.gender}-${
                              size.size_id || "no-size"
                            }`}
                            className="cursor-pointer hover:bg-gray-100"
                            onClick={() =>
                              handleSizeClick(
                                item.category_id,
                                item.category_name,
                                size.size_id,
                                size.size_name,
                                size.gender,
                              )}
                          >
                            <TableCell className="pl-12">
                              {size.size_name}
                            </TableCell>
                            <TableCell>{getAmount(size.items)}</TableCell>
                            <TableCell>
                              {getRefills(size.items, currentDate)}
                            </TableCell>
                            <TableCell>
                              {getDistributions(size.items, currentDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
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
