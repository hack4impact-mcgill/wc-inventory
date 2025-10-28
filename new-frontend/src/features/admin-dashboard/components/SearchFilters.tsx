import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useSearchFiltersQueries } from "../hooks/useSearchFiltersQueries";

interface SearchFiltersProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  actionButtons?: React.ReactNode;
}

const SearchFilters = ({
  onSearch,
  onCategoryChange,
  onSizeChange,
  onGenderChange,
  onStatusChange,
  actionButtons,
}: SearchFiltersProps) => {

  const { categories, sizes } = useSearchFiltersQueries();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");
  const [selectedSizeName, setSelectedSizeName] = useState<string>("all");
  
  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    onCategoryChange(value);
  };

    const handleSizeChange = (value: string) => {
    setSelectedSizeName(value);
    onSizeChange(value);
  };

  const SHOE_CATEGORY_ID = "f9998911-97c2-43fb-86ef-b63162758a55";

  const filteredSizes = selectedCategoryId === SHOE_CATEGORY_ID
    ? sizes?.filter((size) => /^\d+(\.\d+)?T?$/.test(size.name)) // use regex to get only shoe sizes
    : selectedCategoryId !== "all"
    ? sizes?.filter((size) => /^[A-Z]+$/.test(size.name)) // use regex to get only clothing sizes
    : sizes;

  const filteredCategories = /^\d+(\.\d+)?T?$/.test(selectedSizeName)
    ? categories?.filter((category) => category.name === "Shoes")
    : selectedSizeName !== "all"
    ? categories?.filter((category) => category.name !== "Shoes")
    : categories;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex gap-4">

          <Input
            placeholder="Search by box name"
            className="max-w-xs"
            onChange={(e) => onSearch(e.target.value)}
          />

          <Select defaultValue="all" onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Items
              </SelectItem>
              {filteredCategories?.map((category) => (
                <SelectItem 
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="all" onValueChange={handleSizeChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All Sizes
              </SelectItem>
              {filteredSizes?.map((size) => (
                <SelectItem 
                  key={size.size_id} 
                  value={size.name}
                >
                  {size.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="all" onValueChange={onGenderChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="all" value="all">
                All Genders
              </SelectItem>
              {["Male", "Female", "Unisex", "Kids"].map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select defaultValue="Active" onValueChange={onStatusChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem key="Active" value="Active">Active</SelectItem>
              <SelectItem key="Donated" value="Donated">Donated</SelectItem>
            </SelectContent>
          </Select>
          
        </div>
        {actionButtons}
      </div>
    </div>
  );
};

export default SearchFilters;
