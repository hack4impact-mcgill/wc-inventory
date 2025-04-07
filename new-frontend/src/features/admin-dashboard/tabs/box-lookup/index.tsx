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
import { Location } from "@/types/location";
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
  const [locationsByParent, setLocationsByParent] = React.useState<Record<string, Location[]>>({});
  // Location debug state
  const [locationDebugInfo, setLocationDebugInfo] = React.useState<string>("");

  const queryClient = useQueryClient();

  // Add state for debug panel expansion
  const [isDebugPanelExpanded, setIsDebugPanelExpanded] = React.useState<boolean>(false);

  // Use React Query to fetch boxes data
  const { data: boxes = [], isLoading: isLoadingBoxes, isError: isBoxesError, error: boxesError } = useQuery({
    queryKey: ['boxes'],
    queryFn: async () => boxApi.getBoxes(),
  });

  const { locations, isLoading: isLoadingLocations } = useLocations();

  // Organize locations by parent when locations data changes
  React.useEffect(() => {
    if (locations && locations.length > 0) {
      console.log("Raw locations data:", locations);

      // Organize locations by parent
      const locByParent: Record<string, Location[]> = {};

      // Initialize the null parent entry with empty string key
      locByParent[''] = [];

      // Ensure all locations have valid location_id before processing
      locations.forEach(loc => {
        if (!loc.location_id) {
          console.warn("Location without location_id found:", loc);
          return;
        }

        const parentId = loc.parent_id || '';
        if (!locByParent[parentId]) {
          locByParent[parentId] = [];
        }
        locByParent[parentId].push(loc);
      });

      setLocationsByParent(locByParent);
      generateLocationDebugInfo(locByParent);

      // Log the entire location structure for debugging
      console.log("Location structure initialized:", locByParent);
    }
  }, [locations]);

  // Function to generate location debug info
  const generateLocationDebugInfo = (locByParent: Record<string, Location[]>) => {
    let debugInfo = "Location Hierarchy:\n";

    // Level 0 locations (root locations)
    debugInfo += "\nLevel 0 (Root):\n";
    const rootLocations = locByParent[''] || [];
    rootLocations.forEach(loc => {
      if (!loc.location_id) return; // Skip locations with no ID

      debugInfo += `- ${loc.name} (ID: ${loc.location_id})\n`;

      // Level 1 locations (children of root)
      const level1Locations = locByParent[loc.location_id] || [];
      if (level1Locations.length > 0) {
        debugInfo += `  Level 1 (Children of ${loc.name}):\n`;
        level1Locations.forEach(childLoc => {
          if (!childLoc.location_id) return; // Skip locations with no ID

          debugInfo += `  - ${childLoc.name} (ID: ${childLoc.location_id})\n`;

          // Level 2 locations (grandchildren)
          const level2Locations = locByParent[childLoc.location_id] || [];
          if (level2Locations.length > 0) {
            debugInfo += `    Level 2 (Children of ${childLoc.name}):\n`;
            level2Locations.forEach(grandchildLoc => {
              if (!grandchildLoc.location_id) return; // Skip locations with no ID

              debugInfo += `    - ${grandchildLoc.name} (ID: ${grandchildLoc.location_id})\n`;
            });
          }
        });
      }
    });

    setLocationDebugInfo(debugInfo);
    console.log(debugInfo); // Also log to console for easy debugging
  };

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
  const getLocationsForLevel = (level: number): Location[] => {
    if (level === 0) {
      return locationsByParent[''] || [];
    }

    const parentId = selectedLocations[level - 1];
    if (!parentId) return [];

    // Log the locations at this level when retrieving them
    const locationsAtLevel = locationsByParent[parentId] || [];
    console.log(`Locations at level ${level} (parent: ${parentId}):`, locationsAtLevel);

    // Filter out any locations without valid location_id
    return locationsAtLevel.filter(loc => loc.location_id && typeof loc.location_id === 'string');
  };

  const handleLocationSelect = (locationId: string, level: number) => {
    // Make sure we have a valid ID before proceeding
    if (!locationId) {
      console.error("Attempted to select location with invalid ID");
      return;
    }

    console.log(`Selecting location at level ${level}, ID: ${locationId}`);

    // When selecting a location at a level, clear all subsequent levels
    const newSelectedLocations = [...selectedLocations.slice(0, level)];
    newSelectedLocations[level] = locationId;

    // Find the location name for better logging
    let locationName = "Unknown";
    if (level === 0) {
      const location = locationsByParent['']?.find(loc => loc.location_id === locationId);
      locationName = location?.name || "Unknown";
    } else {
      const parentId = selectedLocations[level - 1];
      if (parentId) {
        const location = locationsByParent[parentId]?.find(loc => loc.location_id === locationId);
        locationName = location?.name || "Unknown";
      }
    }

    console.log(`Selected location: ${locationName} (ID: ${locationId}) at level ${level}`);
    console.log("New selected locations array:", newSelectedLocations);

    // Force a state update with the new array
    setSelectedLocations([...newSelectedLocations]);
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

    // Reset selected locations when opening the dialog
    setSelectedLocations([]);

    // Log the location hierarchy before opening the move dialog
    console.log("Opening move dialog, location hierarchy:", locationsByParent);
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

    // Log the selected location path before submitting
    console.log("Moving boxes to location path:", selectedLocations.filter(Boolean));
    console.log("Final target location ID:", targetLocationId);

    moveBoxesMutation.mutate({
      boxIds: selectedBoxIds,
      locationId: targetLocationId
    });
  };

  // Get the name of a location by its ID
  const getLocationNameById = (locationId: string, parentId: string = ''): string => {
    if (!locationId) return 'Unknown';

    const locations = parentId ? locationsByParent[parentId] || [] : locationsByParent[''] || [];
    const location = locations.find(loc => loc.location_id === locationId);
    return location?.name || 'Unknown';
  };

  // Toggle debug panel expansion
  const toggleDebugPanel = () => {
    setIsDebugPanelExpanded(prev => !prev);
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
        <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-2xl relative">
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
        <DialogContent className="sm:max-w-md w-full overflow-hidden">
          <DialogHeader>
            <DialogTitle>Destination location</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 w-full overflow-hidden">
            {/* Collapsible Debug Panel */}
            <div className="w-full border border-gray-200 rounded-md overflow-hidden">
              <button
                onClick={toggleDebugPanel}
                className="w-full flex items-center justify-between p-2 text-sm bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Debug Information</span>
                <span className="text-gray-500">
                  {isDebugPanelExpanded ? '▼' : '►'}
                </span>
              </button>

              {isDebugPanelExpanded && (
                <div className="p-2 border-t border-gray-200">
                  {/* Location debug info panel */}
                  <div className="bg-gray-100 p-2 rounded-md text-xs font-mono max-h-40 overflow-y-auto w-full">
                    <h3 className="font-bold mb-1">Location Hierarchy:</h3>
                    <div className="whitespace-pre overflow-x-auto">
                      {locationDebugInfo || "No location data available."}
                    </div>
                  </div>

                  {/* Current selected location path (for easy debugging) */}
                  <div className="bg-blue-50 p-2 rounded-md mt-2 w-full">
                    <h4 className="text-sm font-medium">Selected locations array:</h4>
                    <div className="text-xs font-mono overflow-x-auto whitespace-pre">
                      {JSON.stringify(selectedLocations, null, 2)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Level 0 locations */}
            <div className="w-full">
              <div className="text-sm text-gray-500 mb-1">Level 0 (Root):</div>
              <Select
                value={selectedLocations[0] || ''}
                onValueChange={(value) => handleLocationSelect(value, 0)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="max-w-[calc(100vw-4rem)]">
                  {isLoadingLocations ? (
                    <SelectItem value="loading" disabled>Loading locations...</SelectItem>
                  ) : (
                    getLocationsForLevel(0).map(location => (
                      location.location_id ? (
                        <SelectItem key={`level0-${location.location_id}`} value={location.location_id}>
                          {location.name || 'Unnamed Location'}
                        </SelectItem>
                      ) : null
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Level 1 locations (if level 0 is selected) */}
            {selectedLocations[0] && getLocationsForLevel(1).length > 0 && (
              <div className="w-full">
                <div className="text-sm text-gray-500 mb-1">
                  Level 1 (Children of {getLocationNameById(selectedLocations[0], '')}):
                </div>
                <Select
                  value={selectedLocations[1] || ''}
                  onValueChange={(value) => handleLocationSelect(value, 1)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sub-location" />
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-4rem)]">
                    {getLocationsForLevel(1).map(location => (
                      location.location_id ? (
                        <SelectItem key={`level1-${location.location_id}`} value={location.location_id}>
                          {location.name || 'Unnamed Location'}
                        </SelectItem>
                      ) : null
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Level 2 locations (if level 1 is selected) */}
            {selectedLocations[1] && getLocationsForLevel(2).length > 0 && (
              <div className="w-full">
                <div className="text-sm text-gray-500 mb-1">
                  Level 2 (Children of {getLocationNameById(selectedLocations[1], selectedLocations[0])}):
                </div>
                <Select
                  value={selectedLocations[2] || ''}
                  onValueChange={(value) => handleLocationSelect(value, 2)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sub-location" />
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-4rem)]">
                    {getLocationsForLevel(2).map(location => (
                      location.location_id ? (
                        <SelectItem key={`level2-${location.location_id}`} value={location.location_id}>
                          {location.name || 'Unnamed Location'}
                        </SelectItem>
                      ) : null
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Selected Location Path Display */}
            <div className="mt-2 p-2 bg-blue-50 rounded-md w-full">
              <h4 className="text-sm font-medium mb-1">Selected Location Path:</h4>
              {selectedLocations.some(Boolean) ? (
                <div className="text-sm">
                  {selectedLocations.filter(Boolean).map((locId, idx) => {
                    let locationName = "Unknown";
                    if (idx === 0) {
                      locationName = getLocationNameById(locId, '');
                    } else if (idx === 1) {
                      locationName = getLocationNameById(locId, selectedLocations[0]);
                    } else if (idx === 2) {
                      locationName = getLocationNameById(locId, selectedLocations[1]);
                    }
                    return (
                      <div key={`path-${idx}`} className="flex items-center">
                        {idx > 0 && <span className="mx-1">→</span>}
                        <span className="truncate">{`Level ${idx}: ${locationName} (${locId})`}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500">No location selected yet</div>
              )}
            </div>
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
              disabled={!selectedLocations.some(Boolean) || moveBoxesMutation.isPending}
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