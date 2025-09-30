import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

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
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex gap-4">
          <Input
            placeholder="Search by box name"
            className="max-w-xs"
            onChange={(e) => onSearch(e.target.value)}
          />
          <Select defaultValue="all" onValueChange={onCategoryChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="T-shirt">T-Shirts</SelectItem>
              <SelectItem value="Pants">Pants</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={onSizeChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sizes</SelectItem>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all" onValueChange={onGenderChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Men">Men</SelectItem>
              <SelectItem value="Women">Women</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="Active" onValueChange={onStatusChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Donated">Donated</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {actionButtons}
      </div>
    </div>
  );
};

export default SearchFilters;
