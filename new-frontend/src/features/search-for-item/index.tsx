import React, { useState } from 'react';
import {
  ChevronDown
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import ItemCard from "@/components/search/components/ItemCard";
import { categories, sizes, genders, items, ContentSize, Gender } from './mock-data'; // Import mock data

const SearchForItem = () => {
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [gender, setGender] = useState("");
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<{ box_content_id: number; box: string; size: ContentSize; categories: string; gender: Gender; quantity: number; }[] | null>(null);

  const handleSearch = () => {
    if (!category && !size && !gender) return;

    const results = items.filter(item => {
      const categoryMatch = !category || item.categories === category;
      const sizeMatch = !size || item.size === size;
      const genderMatch = !gender || item.gender === gender;
      return categoryMatch && sizeMatch && genderMatch;
    });

    setSearchResults(results);
  };

  const handleBoxClick = (box: string) => {
    // Navigate to box location - implement your navigation logic here
    alert(`Navigating to box: ${box}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 2xl:grid-cols-3 gap-4">
        {/* Category Dropdown */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              {category
                ? categories.find((cat) => cat.value === category)?.label
                : "Select category..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categories.map((cat) => (
                  <CommandItem
                    key={cat.value}
                    onSelect={() => {
                      setCategory(cat.value);
                      setOpen(false);
                    }}
                  >
                    <cat.icon className="mr-2 h-4 w-4" />
                    {cat.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Size Dropdown */}
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Select size..." />
          </SelectTrigger>
          <SelectContent>
            {sizes.map((sizeOption) => (
              <SelectItem key={sizeOption} value={sizeOption}>
                {sizeOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gender Dropdown */}
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger>
            <SelectValue placeholder="Select gender..." />
          </SelectTrigger>
          <SelectContent>
            {genders.map((genderOption) => (
              <SelectItem key={genderOption} value={genderOption}>
                {genderOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Search Button */}
      <Button
        className="w-full"
        onClick={handleSearch}
        disabled={!category && !size && !gender}
      >
        Find Items
      </Button>

      {/* Results Section */}
      {searchResults && (
        <div className="space-y-4">
          {searchResults.length === 0 ? (
            <p className="text-center text-gray-500">No items found</p>
          ) : (
            searchResults.map((item) => (
              <ItemCard key={item.box_content_id} item={item} categories={categories} onBoxClick={handleBoxClick} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchForItem;