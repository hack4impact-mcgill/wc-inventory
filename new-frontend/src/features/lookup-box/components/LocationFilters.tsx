import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface LocationNode {
  description: string | null;
  level: number | null;
  location_id: string;
  name: string;
  parent_id: string | null;
  children?: LocationNode[];
}

interface LocationFiltersProps {
  locationTree: LocationNode[];
  selectedRoom: string;
  selectedLevel: string;
  selectedAisle: string;
  selectedRow: string;
  onRoomChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onAisleChange: (value: string) => void;
  onRowChange: (value: string) => void;
}

const LocationFilters = ({
  locationTree,
  selectedRoom,
  selectedLevel,
  selectedAisle,
  selectedRow,
  onRoomChange,
  onLevelChange,
  onAisleChange,
  onRowChange,
}: LocationFiltersProps) => {

  const findChildren = (parentId: string | null): LocationNode[] => {
    if (!locationTree.length) {
      return [];
    }
    if (!parentId) {
      return locationTree;
    }

    const findNode = (nodes: LocationNode[]): LocationNode | null => {
      for (const node of nodes) {
        if (node.location_id === parentId) {
          return node;
        }
        const found = findNode(node.children ?? []);
        if (found) {
          return found;
        }
      }
      return null;
    };

    return findNode(locationTree)?.children || [];
  };

  return (
    <>

      {findChildren(null).length > 0 && (
        <Select
          value={selectedRoom}
          onValueChange={onRoomChange}
        >
          <SelectTrigger
            className="w-11/12 ml-3 max-h-[12rem] flex-1 flex items-center justify-center gap-5 
              p-4 rounded-lg shadow font-medium text-xl [&>svg]:h-8 [&>svg]:w-8"
          >
            <SelectValue placeholder="All Rooms" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem className="text-xl text-black" value="default">
              All Rooms
            </SelectItem>
            {findChildren(null).map((room) => (
              <SelectItem className="text-xl text-black" key={room.location_id} value={room.location_id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedRoom && findChildren(selectedRoom).length > 0 && (
        <Select
          value={selectedLevel}
          onValueChange={onLevelChange}
        >
          <SelectTrigger
            className="w-11/12 ml-3 max-h-[12rem] flex-1 flex items-center justify-center gap-5 
              p-4 rounded-lg shadow font-medium text-xl [&>svg]:h-8 [&>svg]:w-8"
          >
            <SelectValue placeholder="All Levels" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem className="text-xl text-black" value="default">
              All Levels
            </SelectItem>
            {findChildren(selectedRoom).map((level) => (
              <SelectItem className="text-xl text-black" key={level.location_id} value={level.location_id}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedLevel && findChildren(selectedLevel).length > 0 && (
        <Select
          value={selectedAisle}
          onValueChange={onAisleChange}
        >
          <SelectTrigger
            className="w-11/12 ml-3 max-h-[12rem] flex-1 flex items-center justify-center gap-5 
              p-4 rounded-lg shadow font-medium text-2xl [&>svg]:h-8 [&>svg]:w-8"
          >
            <SelectValue placeholder="All Aisles" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem className="text-xl text-black" value="default">
              All Aisles
            </SelectItem>
            {findChildren(selectedLevel).map((aisle) => (
              <SelectItem className="text-xl text-black" key={aisle.location_id} value={aisle.location_id}>
                {aisle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {selectedAisle && findChildren(selectedAisle).length > 0 && (
        <Select
          value={selectedRow}
          onValueChange={onRowChange}
        >
          <SelectTrigger
            className="w-11/12 ml-3 max-h-[12rem] flex-1 flex items-center justify-center gap-5 
              p-4 rounded-lg shadow font-medium text-2xl [&>svg]:h-8 [&>svg]:w-8"
          >
            <SelectValue placeholder="All Rows" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem className="text-xl text-black" value="default">
              All Rows
            </SelectItem>
            {findChildren(selectedAisle).map((row) => (
              <SelectItem className="text-xl text-black" key={row.location_id} value={row.location_id}>
                {row.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

    </>
  );

};

export default LocationFilters;
