import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";
import SearchFilters from "@/features/admin-dashboard/components/SearchFilters";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";
import { supabase } from "@/lib/supabaseClient";
import { BoxItem, BoxView } from "@/types/box";

// Define filter state interface
interface FilterState {
  searchTerm: string;
  category: string;
  size: string;
  gender: string;
}

const BoxLookup: React.FC = () => {
  const [selectedBoxIds, setSelectedBoxIds] = React.useState<string[]>([]);
  const [filters, setFilters] = React.useState<FilterState>({
    searchTerm: "",
    category: "all",
    size: "all",
    gender: "all"
  });

  // Use React Query to fetch data
  const { data: boxes = [], isLoading, isError, error } = useQuery<BoxView[]>({
    queryKey: ['boxes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('box_view').select('*');

      if (error) {
        throw new Error(error.message);
      }

      return data as BoxView[];
    }
  });

  // Filter boxes based on search term and filters - memoized for performance
  const filteredBoxes = React.useMemo(() => {
    return boxes.filter(box => {
      // Filter by search term (box name)
      if (filters.searchTerm && !box.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // If box has no contents, only apply name filter
      if (!box.contents || box.contents.length === 0) {
        return true;
      }

      // Filter by contents
      if (filters.category !== 'all' || filters.size !== 'all' || filters.gender !== 'all') {
        return box.contents.some(item => {
          // Filter by category (item type)
          if (filters.category !== 'all') {
            const categoryMapping: Record<string, string> = {
              'tshirts': 'T-shirt',
              'pants': 'Pants'
            };
            if (item.type !== categoryMapping[filters.category]) {
              return false;
            }
          }

          // Filter by size
          if (filters.size !== 'all' && item.size !== filters.size.toUpperCase()) {
            return false;
          }

          // Filter by gender
          if (filters.gender !== 'all') {
            const genderMapping: Record<string, string> = {
              'male': 'Men',
              'female': 'Women',
              'kids': 'Kids',
              'unisex': 'Unisex'
            };
            if (item.gender !== genderMapping[filters.gender]) {
              return false;
            }
          }

          return true;
        });
      }

      return true;
    });
  }, [boxes, filters]);

  // Handle filter changes
  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle box selection logic
  const handleBoxSelect = (boxId: string) => {
    setSelectedBoxIds(prev => {
      const isSelected = prev.includes(boxId);
      return isSelected
        ? prev.filter(id => id !== boxId)
        : [...prev, boxId];
    });
  };

  const handleSelectAll = () => {
    setSelectedBoxIds(
      selectedBoxIds.length === filteredBoxes.length
        ? []
        : filteredBoxes.map(box => box.id)
    );
  };

  // Generate combined content view for multiple selected boxes
  const getSelectedBoxesContent = () => {
    if (selectedBoxIds.length === 0) return null;

    const selectedBoxes = boxes.filter(box => selectedBoxIds.includes(box.id));

    if (selectedBoxIds.length === 1) {
      // Single box view
      const box = selectedBoxes[0];
      return (
        <BoxDetails
          boxName={box.name}
          location={box.location || ""}
          createdAt={box.createdAt || ""}
          updatedAt={box.updatedAt || ""}
          contents={box.contents}
        />
      );
    } else {
      // Multiple boxes view - sum up contents
      const combinedContents: Record<string, BoxItem> = {};

      selectedBoxes.forEach(box => {
        box.contents?.forEach(item => {
          const key = `${item.type}-${item.gender}-${item.size}`;
          if (!combinedContents[key]) {
            combinedContents[key] = { ...item, quantity: 0 };
          }
          combinedContents[key].quantity += item.quantity;
        });
      });

      return (
        <BoxDetails
          boxName={`${selectedBoxes.length} boxes selected`}
          location=""
          createdAt=""
          updatedAt=""
          contents={Object.values(combinedContents)}
          isMultiSelect={true}
        />
      );
    }
  };

  // Action buttons for selected boxes
  const actionButtons = (
    <div className="flex gap-4">
      <Button variant="outline">Print label</Button>
      <Button variant="outline">Move</Button>
      <Button variant="outline">Donate</Button>
    </div>
  );

  // Handle loading and error states
  if (isLoading) return <div className="p-6">Loading inventory data...</div>;
  if (isError) return <div className="p-6 text-red-500">Error loading inventory: {error?.message}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1">
          <SearchFilters
            onSearch={(value) => handleFilterChange('searchTerm', value)}
            onCategoryChange={(value) => handleFilterChange('category', value)}
            onSizeChange={(value) => handleFilterChange('size', value)}
            onGenderChange={(value) => handleFilterChange('gender', value)}
            actionButtons={actionButtons}
          />

          <Card className="mt-6 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBoxIds.length === filteredBoxes.length && filteredBoxes.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all boxes"
                    />
                  </TableHead>
                  <TableHead>Box name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoxes.length > 0 ? (
                  filteredBoxes.map((box) => (
                    <TableRow key={box.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleBoxSelect(box.id)}>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedBoxIds.includes(box.id)}
                          onCheckedChange={() => handleBoxSelect(box.id)}
                          aria-label={`Select box ${box.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {box.name}
                      </TableCell>
                      <TableCell>{box.location || "—"}</TableCell>
                      <TableCell>
                        Qty: {box.contents?.reduce((sum, item) => sum + item.quantity, 0) || 0}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No boxes found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right panel for box details */}
        <div className="w-full md:w-96">
          {getSelectedBoxesContent()}
        </div>
      </div>
    </div>
  );
};

export default BoxLookup;
