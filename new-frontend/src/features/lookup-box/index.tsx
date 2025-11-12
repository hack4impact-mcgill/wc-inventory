import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import MainFilters from "./components/MainFilters"
import ItemFilters from "./components/ItemFilters"
import BoxFilters from "./components/BoxFilters"
import LocationFilters from "./components/LocationFilters"
import FilterResults from "./components/FilterResults"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boxApi } from "@/lib/api/boxes";
import { useLocations } from "@/features/admin-dashboard/tabs/location-management/hooks/use-locations.ts";
import { toast } from "sonner";
import DonateDialog from "@/features/admin-dashboard/tabs/box-lookup/components/DonateDialog";
import MoveDialog from "@/features/admin-dashboard/tabs/box-lookup/components/MoveDialog";
import { BoxStatus } from "@/types/enums";
import { printBoxLabels } from "@/features/admin-dashboard/tabs/box-lookup/utils";
import { useSearchFiltersQueries } from "@/features/admin-dashboard/hooks/useSearchFiltersQueries";
import { buildLocationTree } from "@/features/add-box/utils";


type ViewType = "main-filter" | "item-filter" | "box-filter" | "location-filter" | "filter-results"
type FilterType = "item" | "box-id" | "location";

interface FilterStateItem {
  category: string;
  size: string;
  gender: string;
  status: BoxStatus; 
}

interface FilterStateLocation {
  room: string;
  level: string;
  aisle: string;
  row: string;
}

const genderMapping: Record<string, string> = {
  male: "Men",
  female: "Women",
  kids: "Kids",
  unisex: "Unisex",
};

const LookupBox = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewType>("main-filter");
  const [prevView, setPrevView] = useState<ViewType>("main-filter");

  const [filterType, setFilterType] = useState<FilterType>("item");
  const [itemFilters, setItemFilters] = useState<FilterStateItem>({ 
      category: "all", 
      size: "all", 
      gender: "all", 
      status: "Active" 
  });
  const [boxIdFilters, setBoxIdFilters] = useState<Record<string, string>>({});
  const [locationFilters, setLocationFilters] = useState<FilterStateLocation>({ 
      room: "default", 
      level: "default", 
      aisle: "default", 
      row: "default" 
  });

  const queryClient = useQueryClient();
  const { locations, isLoading: isLoadingLocations } = useLocations();
  
  const { categories, sizes } = useSearchFiltersQueries();

  const [isMoveDialogOpen, setIsMoveDialogOpen] = useState(false);
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [, setSelectedLocations] = useState<string[]>([]);
  const [selectedBoxIds, setSelectedBoxIds] = useState<string[]>([]);

  // build locationTree for location filters
  const locationTree = locations
    ? buildLocationTree(locations.map((loc) => ({ ...loc, children: [] })))
    : [];
  // location id : name mapping for filter logic
  const locationsMap = Object.fromEntries(locations.map(l => [l.location_id, l.name]));

  // Use React Query to fetch boxes data
  const {
    data: boxes = [],
    isLoading: isLoadingBoxes,
    isError: isBoxesError,
    error: boxesError,
  } = useQuery({
    queryKey: ["boxes"],
    queryFn: async () => boxApi.getBoxes(),
  });

  // filter boxes based on filter type
  const filteredBoxes = useMemo(() => {
    return boxes.filter((box) => {

      if (filterType === "item") {
        const selectedCategoryName =
          categories?.find((c) => c.category_id === itemFilters.category)?.name ?? "all";
        const selectedSizeName =
          sizes?.find((s) => s.size_id === itemFilters.size)?.name ?? "all";

        return (
          box.status === itemFilters.status &&
          (selectedCategoryName === "all" ||
            box.contents?.some((item) => item.type === selectedCategoryName)) &&
          (selectedSizeName === "all" ||
            box.contents?.some((item) => item.size === selectedSizeName)) &&
          (itemFilters.gender === "all" ||
            box.contents?.some((item) => item.gender === genderMapping[itemFilters.gender.toLowerCase()]))
        );
      }
      else if (filterType === "box-id") {
        if (Object.entries(boxIdFilters).length === 0) {
          return true;
        }
        return box.id in boxIdFilters;
      }
      else if (filterType === "location") {
        const locationParts = box.location?.split(" > ") ?? [];

        return (
          (locationFilters.room === "default" || locationParts.includes(locationsMap[locationFilters.room])) &&
          (locationFilters.level === "default" || locationParts.includes(locationsMap[locationFilters.level])) &&
          (locationFilters.aisle === "default" || locationParts.includes(locationsMap[locationFilters.aisle])) &&
          (locationFilters.row === "default" || locationParts.includes(locationsMap[locationFilters.row]))
        );
      }

      return true;
    });
  }, [boxes, filterType, itemFilters, boxIdFilters, locationFilters]);

  const title = view === "filter-results"
    ? "Box List"
    : view === "item-filter"
      ? "Search Box by Item"
      : view === "box-filter"
        ? "Search Box by ID"
        : view === "location-filter"
          ? "Search Box by Location"
          : "Inventory Management";

  const moveBoxesMutation = useMutation({
    mutationFn: ({
      boxIds,
      locationId,
    }: {
      boxIds: string[];
      locationId: string;
    }) => boxApi.moveBoxes(boxIds, locationId),
    onSuccess: () => {
      toast.success(
        `${selectedBoxIds.length} ${
          selectedBoxIds.length === 1 ? "box" : "boxes"
        } moved successfully.`,
      );
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      setSelectedBoxIds([]);
      setIsMoveDialogOpen(false);
      setSelectedLocations([]);
    },
    onError: (error) => {
      toast.warning(
        `Failed to move boxes: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    },
  });

  // Organize locations by parent when locations data changes
  // Mutations for box operations
  const donateBoxesMutation = useMutation({
    mutationFn: (boxIds: string[]) => boxApi.donateBoxes(boxIds),
    onSuccess: () => {
      toast.success(
        `${selectedBoxIds.length} ${
          selectedBoxIds.length === 1 ? "box" : "boxes"
        } donated successfully.`,
      );
      queryClient.invalidateQueries({ queryKey: ["boxes"] });
      setSelectedBoxIds([]);
      setIsDonateDialogOpen(false);
    },
    onError: (error) => {
      toast.error(
        `Failed to donate boxes: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    },
  });
    
  const handleGoBack = () => {
    if (view === "main-filter") {
      navigate("/");
    }
    else {
      setView(prevView);
      setPrevView("main-filter");
    }
  };

  const handleItemFilter = () => {
    setFilterType("item");
    setView("item-filter"); 
  };

  const handleBoxFilter = () => {
    setFilterType("box-id");
    setView("box-filter"); 
  }; 

  const handleLocationFilter = () => {
    setFilterType("location");
    setView("location-filter"); 
  };

  const handleSearch = () => {
    if (view === "box-filter" && Object.entries(boxIdFilters).length === 0) {
      toast.info("Please select at least one box to search.");
      return;
    }
    setPrevView(view);
    setView("filter-results"); 
    setSelectedBoxIds([]);
  };

  const handleItemFilterChange = (filterType: keyof FilterStateItem, value: string) => {
    setItemFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };
  
  const handleBoxIdFilterChange= (id: string, name: string) => {
    setBoxIdFilters((prev) => {
      const updated = {...prev};
      if (id in updated) {
        delete updated[id];
      }
      else {
        updated[id] = name;
      }
      return updated;
    });
  };
  
  const clearAllBoxIds = () => {
    setBoxIdFilters({});
  };

  const handleLocationFilterChange = (filterType: keyof FilterStateLocation, value: string) => {
    setLocationFilters((prev) => {
      const updated = { ...prev };

      if (filterType === "room") {
        updated.room = value;
        updated.level = "default";
        updated.aisle = "default";
        updated.row = "default";
      } else if (filterType === "level") {
        updated.level = value;
        updated.aisle = "default";
        updated.row = "default";
      } else if (filterType === "aisle") {
        updated.aisle = value;
        updated.row = "default";
      } else if (filterType === "row") {
        updated.row = value;
      }

      return updated;
    });
  };

  // Handle box selection logic
  const handleBoxSelect = (boxId: string) => {
    setSelectedBoxIds((prev) => {
      const isSelected = prev.includes(boxId);
      return isSelected ? prev.filter((id) => id !== boxId) : [...prev, boxId];
    });
  };

  const handleSelectAll = () => {
    setSelectedBoxIds(
      selectedBoxIds.length === filteredBoxes.length
        ? []
        : filteredBoxes.map((box) => box.id),
    );
  };

  const handlePrintLabel = () => {
    if (selectedBoxIds.length === 0) {
      toast.info("Please select at least one box to print.");
      return;
    }

    const selectedBoxes = boxes.filter((box) =>
      selectedBoxIds.includes(box.id)
    );
    printBoxLabels(selectedBoxes);
  };

  const handleMoveClick = () => {
    if (selectedBoxIds.length === 0) {
      toast.info("Please select at least one box to move.");
      return;
    }

    // Reset selected locations when opening the dialog
    setSelectedLocations([]);

    // Log the location hierarchy before opening the move dialog
    setIsMoveDialogOpen(true);
  };

  const handleConfirmMove = (locationId: string) => {
    // The validation is now happening in the MoveDialog component
    // Here we just need to handle the mutation
    moveBoxesMutation.mutate({
      boxIds: selectedBoxIds,
      locationId,
    });
  };

  const handleDonateClick = () => {
    if (selectedBoxIds.length === 0) {
      toast.info("Please select at least one box to donate.");
      return;
    }
    setIsDonateDialogOpen(true);
  };

  const handleConfirmDonation = () => {
    donateBoxesMutation.mutate(selectedBoxIds);
  };

  const handleViewContents = () => {
    if (selectedBoxIds.length === 0) {
      toast.info("Please select at least one box to view its contents.");
      return;
    }
    navigate("/lookup/view-contents", { state: 
      { boxIds: selectedBoxIds, filters: { filterType, itemFilters, boxIdFilters, locationFilters, }, views: { view, prevView} } 
    } );
  };

  // Handle loading and error states
  if (isLoadingBoxes) {
    return (
      <div className="p-6">
        Loading inventory data...
      </div>
    );
  }
  if (isBoxesError) {
    return (
      <div className="p-6 text-red-500">
        Error loading inventory: {boxesError?.message}
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center bg-white px-4 overflow-hidden">
      
      <div className="flex-[1] h-full w-full max-w-screen-md flex items-center justify-start">
        <button 
          className="mr-6 p-2 rounded-lg font-bold bg-gray-300 mb-3 duration-300 ease-in-out shadow transform transition-all hover:shadow-xl"
          onClick={handleGoBack}
        >
          <ArrowLeft size={30} />
        </button>
        <h1 className="lg:text-2xl text-xl font-bold text-gray-900 tracking-wide text-center mb-8 pt-4">
          {title}
        </h1>
      </div>

      <div className="flex-[4] basis-0 w-full max-w-screen-md flex flex-col justify-center gap-12 overflow-hidden">

        {view === "main-filter" && (
          <MainFilters
            handleItemFilter={handleItemFilter}
            handleBoxFilter={handleBoxFilter} 
            handleLocationFilter={handleLocationFilter}
          /> 
        )}

        {view === "item-filter" && (
          <ItemFilters
            categories={categories}
            sizes={sizes}
            selectedCategoryId={itemFilters.category}
            selectedSizeId={itemFilters.size}
            selectedGender={itemFilters.gender}
            selectedStatus={itemFilters.status}
            onCategoryChange={(value) => handleItemFilterChange("category", value)}
            onSizeChange={(value) => handleItemFilterChange("size", value)}
            onGenderChange={(value) => handleItemFilterChange("gender", value)}
            onStatusChange={(value) => handleItemFilterChange("status", value)}
          />
        )}

        {view === "box-filter" && (
          <BoxFilters
            boxes={boxes}
            boxIdFilters={boxIdFilters}
            handleBoxIdFilterChange={handleBoxIdFilterChange}
            clearAllBoxIds={clearAllBoxIds}
          /> 
        )}

        {view === "location-filter" && (
          <LocationFilters
            locationTree={locationTree}
            selectedRoom={locationFilters.room}
            selectedLevel={locationFilters.level}
            selectedAisle={locationFilters.aisle}
            selectedRow={locationFilters.row}
            onRoomChange={(value) => handleLocationFilterChange("room", value)}
            onLevelChange={(value) => handleLocationFilterChange("level", value)}
            onAisleChange={(value) => handleLocationFilterChange("aisle", value)}
            onRowChange={(value) => handleLocationFilterChange("row", value)}
          /> 
        )}

        {view === "filter-results" && (
          <>
            <FilterResults
              handlePrintLabel={handlePrintLabel}
              handleMoveClick={handleMoveClick}
              handleDonateClick={handleDonateClick}
              handleBoxSelect={handleBoxSelect}
              handleSelectAll={handleSelectAll}
              filteredBoxes={filteredBoxes}
              selectedBoxIds={selectedBoxIds}
            />

            <div className="flex justify-center">
              <button 
                className="w-3/4 bg-gray-300 p-4 mb-2 rounded-lg shadow font-bold duration-300 ease-in-out transform transition-all hover:shadow-lg"
                onClick={handleViewContents}
              >
                <p className="text-2xl">
                  View Contents
                </p>
              </button>
            </div>

            {/* Donation Confirmation Dialog */}
            <DonateDialog
              open={isDonateDialogOpen}
              onOpenChange={setIsDonateDialogOpen}
              onConfirm={handleConfirmDonation}
              boxCount={selectedBoxIds.length}
              isProcessing={donateBoxesMutation.isPending}
            />
            {/* Move Location Dialog */}
            <MoveDialog
              open={isMoveDialogOpen}
              onOpenChange={setIsMoveDialogOpen}
              onConfirm={handleConfirmMove}
              locations={locations}
              isLoading={isLoadingLocations}
              isProcessing={moveBoxesMutation.isPending}
            />
          </>
        )}

        {["item-filter", "box-filter", "location-filter"].includes(view) && (
          <div className="max-h-[12rem] flex-1 flex justify-center">
            <button 
              className="w-3/4 bg-gray-950 hover:bg-gray-800 text-white p-4 mb-2 rounded-lg shadow font-bold duration-300 ease-in-out transform transition-all hover:shadow-lg"
              onClick={handleSearch}
            >
              <p className="text-2xl">
                Search
              </p>
            </button>
          </div>
        )}

      </div>

    </div>
  );

};

export default LookupBox;
