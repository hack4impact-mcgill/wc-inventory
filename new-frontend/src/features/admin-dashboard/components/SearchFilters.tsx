// features/admin-dashboard/components/SearchFilters.tsx
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

interface SearchFiltersProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  actionButtons?: React.ReactNode;
}

const SearchFilters = ({
  onSearch,
  onCategoryChange,
  onSizeChange,
  onGenderChange,
  actionButtons,
}: SearchFiltersProps) => {
  const [showScanner, setShowScanner] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    onSearch(value);
  };

  const handleScanResult = (text: string) => {
    const timestamp = Number(text);
    if (!isNaN(timestamp)) {
      // Assuming the barcode timestamp is in seconds; multiply by 1000 to convert to milliseconds.
      const date = new Date(timestamp * 1000);
      const isoWithoutMs = date.toISOString().slice(0, 19) + "Z";

      setSearchValue(isoWithoutMs);
      onSearch(isoWithoutMs);
    } else {
      // Fallback if the scanned value isn't a number
      setSearchValue(text);
      onSearch(text);
    }
    setShowScanner(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1 flex gap-4">
          <div className="flex">
            <Input
              placeholder="Search by box name"
              className="max-w-xs"
              onChange={(e) => handleSearchChange(e.target.value)}
              value={searchValue}
            />
            <Dialog open={showScanner} onOpenChange={setShowScanner}>
              <DialogTrigger asChild>
                <Button type="button">Barcode</Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Scan Barcode</DialogTitle>
                </DialogHeader>
                <BarcodeScannerComponent
                  width={400}
                  height={400}
                  onUpdate={(err, result) => {
                    if (result) handleScanResult((result as any).text);
                  }}
                />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  Point the camera at a barcode to scan.
                </p>
              </DialogContent>
            </Dialog>
          </div>

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
        </div>
        {actionButtons}
      </div>
      <Button variant="outline" className="w-full bg-black text-white">
        Find Items
      </Button>
    </div>
  );
};

export default SearchFilters;
