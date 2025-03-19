// src/features/admin-dashboard/tabs/box-lookup/index.tsx
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SearchFilters from "@/features/admin-dashboard/components/SearchFilters";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";
import { BoxItem } from "@/types/box";
import { boxApi } from "@/lib/api/boxes";
import { LocalLocation } from "@/lib/api/locations";
import { useLocations } from "@/features/admin-dashboard/tabs/location-management/hooks/use-locations.ts"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from 'react-hot-toast';

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

  // Dialog states
  const [isDonateDialogOpen, setIsDonateDialogOpen] = React.useState(false);
  const [isMoveDialogOpen, setIsMoveDialogOpen] = React.useState(false);

  // Location selection states
  const [selectedLocations, setSelectedLocations] = React.useState<string[]>([]);
  const [locationsByParent, setLocationsByParent] = React.useState<Record<string | null, LocalLocation[]>>({});

  const queryClient = useQueryClient();

  // Use React Query to fetch boxes data
  const { data: boxes = [], isLoading: isLoadingBoxes, isError: isBoxesError, error: boxesError } = useQuery({
    queryKey: ['boxes'],
    queryFn: async () => boxApi.getBoxes(),
  });

  // With this:
  const { locations, isLoading: isLoadingLocations } = useLocations();

  // And modify the useEffect to handle the typing properly:
  React.useEffect(() => {
    if (locations && locations.length > 0) {
      // Organize locations by parent
      const locByParent: Record<string, LocalLocation[]> = {};

      // Initialize the null parent entry with empty string key
      locByParent[''] = [];

      locations.forEach(loc => {
        const parentId = loc.parent_id || '';
        if (!locByParent[parentId]) {
          locByParent[parentId] = [];
        }
        // Type assertion to convert Location to LocalLocation
        locByParent[parentId].push(loc as unknown as LocalLocation);
      });

      // Update the state (you'll need to modify getLocationsForLevel accordingly)
      setLocationsByParent(locByParent);
    }
  }, [locations]);
  // Mutations for box operations
  const donateBoxesMutation = useMutation({
    mutationFn: (boxIds: string[]) => boxApi.donateBoxes(boxIds),
    onSuccess: () => {
      toast.success(`${selectedBoxIds.length} ${selectedBoxIds.length === 1 ? 'box' : 'boxes'} donated successfully.`);
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
      setSelectedBoxIds([]);
      setIsDonateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to donate boxes: ${error instanceof Error ? error.message : String(error)}`);
    }
  });

  const moveBoxesMutation = useMutation({
    mutationFn: ({ boxIds, locationId }: { boxIds: string[], locationId: string }) =>
      boxApi.moveBoxes(boxIds, locationId),
    onSuccess: () => {
      toast({
        title: "Success",
        description: `${selectedBoxIds.length} ${selectedBoxIds.length === 1 ? 'box' : 'boxes'} moved successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ['boxes'] });
      setSelectedBoxIds([]);
      setIsMoveDialogOpen(false);
      setSelectedLocations([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to move boxes: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive",
      });
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

  // Location selection handlers
  const getLocationsForLevel = (level: number): LocalLocation[] => {
    if (level === 0) {
      return locationsByParent[''] || [];
    }

    const parentId = selectedLocations[level - 1];
    if (!parentId) return [];

    return locationsByParent[parentId] || [];
  };

  const handleLocationSelect = (locationId: string, level: number) => {
    // When selecting a location at a level, clear all subsequent levels
    const newSelectedLocations = [...selectedLocations.slice(0, level), locationId];
    setSelectedLocations(newSelectedLocations);
  };

  // Dialog handlers
  const handleDonateClick = () => {
    if (selectedBoxIds.length === 0) {
      toast({
        title: "No boxes selected",
        description: "Please select at least one box to donate.",
        variant: "destructive",
      });
      return;
    }
    setIsDonateDialogOpen(true);
  };

  const handleMoveClick = () => {
    if (selectedBoxIds.length === 0) {
      toast({
        title: "No boxes selected",
        description: "Please select at least one box to move.",
        variant: "destructive",
      });
      return;
    }
    setIsMoveDialogOpen(true);
  };

  const handleConfirmDonation = () => {
    donateBoxesMutation.mutate(selectedBoxIds);
  };

  const handleConfirmMove = () => {
    // Get the most specific selected location (the last non-empty one)
    const targetLocationId = selectedLocations.filter(Boolean).pop();
    if (!targetLocationId) {
      toast({
        title: "No location selected",
        description: "Please select a destination location.",
        variant: "destructive",
      });
      return;
    }

    moveBoxesMutation.mutate({
      boxIds: selectedBoxIds,
      locationId: targetLocationId
    });
  };

  // Action buttons for selected boxes
  const actionButtons = (
    <div className="flex gap-4">
      <Button variant="outline">Print label</Button>
      <Button
        variant="outline"
        onClick={handleMoveClick}
        disabled={selectedBoxIds.length === 0}
      >
        Move
      </Button>
      <Button
        variant="outline"
        onClick={handleDonateClick}
        disabled={selectedBoxIds.length === 0}
      >
        Donate
      </Button>
    </div>
  );

  // Handle loading and error states
  if (isLoadingBoxes) return <div className="p-6">Loading inventory data...</div>;
  if (isBoxesError) return <div className="p-6 text-red-500">Error loading inventory: {boxesError?.message}</div>;

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

      {/* Donation Confirmation Dialog */}
      <Dialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm donation of {selectedBoxIds.length} {selectedBoxIds.length === 1 ? 'box' : 'boxes'}?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setIsDonateDialogOpen(false)}>
              ❌ Cancel
            </Button>
            <Button onClick={handleConfirmDonation} disabled={donateBoxesMutation.isPending}>
              {donateBoxesMutation.isPending ? "Processing..." : "✅ Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Move Location Dialog */}
      <Dialog open={isMoveDialogOpen} onOpenChange={setIsMoveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Destination location</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            {/* Level 0 locations */}
            <Select
              value={selectedLocations[0]}
              onValueChange={(value) => handleLocationSelect(value, 0)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingLocations ? (
                  <SelectItem value="loading" disabled>Loading locations...</SelectItem>
                ) : (
                  getLocationsForLevel(0).map(location => (
                    <SelectItem key={`level0-${location.id}`} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {/* Level 1 locations (if level 0 is selected) */}
            {selectedLocations[0] && getLocationsForLevel(1).length > 0 && (
              <Select
                value={selectedLocations[1]}
                onValueChange={(value) => handleLocationSelect(value, 1)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-location" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationsForLevel(1).map(location => (
                    <SelectItem key={`level1-${location.id}`} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {/* Level 2 locations (if level 1 is selected) */}
            {selectedLocations[1] && getLocationsForLevel(2).length > 0 && (
              <Select
                value={selectedLocations[2]}
                onValueChange={(value) => handleLocationSelect(value, 2)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-location" />
                </SelectTrigger>
                <SelectContent>
                  {getLocationsForLevel(2).map(location => (
                    <SelectItem key={`level2-${location.id}`} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsMoveDialogOpen(false)}
              className="mr-auto"
            >
              ❌ Cancel
            </Button>
            <Button
              onClick={handleConfirmMove}
              disabled={selectedLocations.filter(Boolean).length === 0 || moveBoxesMutation.isPending}
            >
              {moveBoxesMutation.isPending ? "Processing..." : "✅ Done"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoxLookup;