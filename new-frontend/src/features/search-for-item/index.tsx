import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
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
import { categories, sizes, genders, ContentSize, Gender } from './mock-data';
import { useQuery } from '@tanstack/react-query';
import { fetchBoxes } from '@/lib/api';

const ALL_VALUE = "all";

const SearchForItem = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // Initialize state from URL parameters or default to "all"
  const [category, setCategory] = useState(searchParams.get('category') || ALL_VALUE);
  const [size, setSize] = useState(searchParams.get('size') || ALL_VALUE);
  const [gender, setGender] = useState(searchParams.get('gender') || ALL_VALUE);
  const [searchResults, setSearchResults] = useState<{ box_content_id: number; box: string; size: ContentSize; categories: string; gender: Gender; quantity: number; }[] | null>(null);

  const { data: boxes, isLoading } = useQuery({
    queryKey: ["boxView"],
    queryFn: fetchBoxes,
  });

  console.log(boxes);

  // Effect to handle URL parameter changes
  useEffect(() => {
    const urlCategory = searchParams.get('category') || ALL_VALUE;
    const urlSize = searchParams.get('size') || ALL_VALUE;
    const urlGender = searchParams.get('gender') || ALL_VALUE;

    setCategory(urlCategory);
    setSize(urlSize);
    setGender(urlGender);

    // Perform search if URL parameters are present
    if (urlCategory || urlSize || urlGender) {
      performSearch(urlCategory, urlSize, urlGender);
    }
  }, [searchParams, boxes]);

  const performSearch = (
    categoryValue: string,
    sizeValue: string,
    genderValue: string
  ) => {
    if (!boxes) return;

    const results = boxes.filter(box => {
      const categoryMatch = categoryValue === ALL_VALUE || box.category_name === categoryValue;
      const sizeMatch = sizeValue === ALL_VALUE || box.size === sizeValue;
      const genderMatch = genderValue === ALL_VALUE || box.gender === genderValue;
      return categoryMatch && sizeMatch && genderMatch;
    });
    setSearchResults(results);
  };

  const handleSearch = () => {
    // Update URL parameters
    const params = new URLSearchParams({
      category,
      size,
      gender,
    });

    setSearchParams(params);
    performSearch(category, size, gender);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    setOpen(false);
  };

  const handleBoxClick = (box: string) => {
    alert(`Navigating to box: ${box}`);
  };

  // Add "All" to the categories list for display
  const displayCategories = [
    { value: ALL_VALUE, label: "All Categories", icon: categories[0].icon },
    ...categories
  ];

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
              {category === ALL_VALUE
                ? "All Categories"
                : categories.find((cat) => cat.value === category)?.label || "Select category..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search category..." />
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {displayCategories.map((cat) => (
                  <CommandItem
                    key={cat.value}
                    onSelect={() => handleCategoryChange(cat.value)}
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
            <SelectItem value={ALL_VALUE}>All Sizes</SelectItem>
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
            <SelectItem value={ALL_VALUE}>All Genders</SelectItem>
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
      >
        Find Items
      </Button>

      {/* Results Section */}
      {isLoading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        searchResults && (
          <div className="space-y-4">
            {searchResults.length === 0 ? (
              <p className="text-center text-gray-500">No items found</p>
            ) : (
              searchResults.map((box) => (
                <ItemCard
                  key={box.box_content_id}
                  box={box}
                  onBoxClick={handleBoxClick}
                />
              ))
            )}
          </div>
        )
      )}
    </div>
  );
};

export default SearchForItem;