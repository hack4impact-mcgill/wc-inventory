import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package } from "@phosphor-icons/react";
import { buildLocationTree } from "./utils";
import { BoxContent, InsertBoxContent } from "@/types/boxContent";
import { GenderEnum } from "@/types/enums";
import { useSaveBox } from "./hooks/useCreateBox";
import { useAddBoxQueries } from "./hooks/useAddBoxQueries";

interface BoxLocation {
  room: string;
  level: string;
  aisle: string;
  row: string;
}

export interface LocationNode {
  location_id: string;
  name: string;
  description: string | null;
  level: number | null;
  parent_id: string | null;
  children: LocationNode[];
}

const AddBox = () => {
  const [items, setItems] = useState<BoxContent[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [sizeId, setSizeId] = useState<string>("");
  const [gender, setGender] = useState<GenderEnum | "">("");
  const [quantity, setQuantity] = useState<number>(1);
  const [location, setLocation] = useState<BoxLocation>({
    room: "",
    level: "",
    aisle: "",
    row: "",
  });
  const [nextBoxId, setNextBoxId] = useState<number | null>(null);

  const { locations, categories, sizes, boxCount } = useAddBoxQueries();
  
  // Set the next box ID when component loads or box count changes
  useEffect(() => {
    if (boxCount !== undefined) {
      setNextBoxId(boxCount + 1);
    }
  }, [boxCount]);

  const locationTree = locations
    ? buildLocationTree(locations.map((loc) => ({ ...loc, children: [] })))
    : [];

  // Filter out any parent categories (like "Clothings")
  const leafCategories = categories?.filter(category => 
    !categories.some(c => c.parent_id === category.category_id)
  );

  const saveBoxMutation = useSaveBox({
    items,
    boxCount,
    location,
    onAddSuccess: () => {
      setItems([]);
      setCategoryId("");
      setSizeId("");
      setGender("");
      setQuantity(1);
      setLocation({ room: "", level: "", aisle: "", row: "" });
      // Update the next box ID after saving
      if (nextBoxId !== null) {
        setNextBoxId(nextBoxId + 1);
      }
    },
  });

  const handleAdd = () => {
    if (!categoryId || !sizeId || !gender) return;

    const newItem: InsertBoxContent = {
      category_id: categoryId,
      size_id: sizeId,
      gender: gender as GenderEnum,
      quantity,
      box_id: "",
    };

    setItems([...items, newItem]);
    setCategoryId("");
    setSizeId("");
    setGender("");
    setQuantity(1);
  };

  const getLocationName = (locationId: string): string => {
    const findNodeName = (nodes: LocationNode[]): string => {
      for (const node of nodes) {
        if (node.location_id === locationId) return node.name;
        const found = findNodeName(node.children);
        if (found) return found;
      }
      return "";

    };
    return findNodeName(locationTree);
  };

  const findChildren = (parentId: string | null): LocationNode[] => {
    if (!locationTree.length) return [];
    if (!parentId) return locationTree;

    const findNode = (nodes: LocationNode[]): LocationNode | null => {
      for (const node of nodes) {
        if (node.location_id === parentId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    return findNode(locationTree)?.children || [];
  };

  const getItemIcon = (categoryId: string) => {
    const category = categories?.find((cat) => cat.category_id === categoryId);
    if (!category) return <Package weight="duotone" size={20} />;
    
    // Use icon from category data
    if (category.icon) {
      try {
        // Dynamic import of icon from @phosphor-icons/react based on category.icon value
        const IconComponent = require('@phosphor-icons/react')[category.icon];
        if (IconComponent) {
          return <IconComponent weight="duotone" size={20} />;
        }
      } catch (error) {
        console.error("Icon not found:", category.icon);
      }
    }
    
    // Fallback to Package icon
    return <Package weight="duotone" size={20} />;
  };

  const locationDisplay = (
    <p className="text-sm">
      Location: {location.room && getLocationName(location.room)}
      {location.level && `, ${getLocationName(location.level)}`}
      {location.aisle && `, ${getLocationName(location.aisle)}`}
      {location.row && `, ${getLocationName(location.row)}`}
    </p>
  );

  const levelSelectorCard = (
    <Card className="shadow-sm">
      <CardContent className="p-6 space-y-4">
        <p className="font-semibold ">Location</p>
        {findChildren(null).length > 0 && (
          <Select
            value={location.room}
            onValueChange={(value) =>
              setLocation({ ...location, room: value, level: "", aisle: "", row: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(null).map((room) => (
                <SelectItem key={room.location_id} value={room.location_id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {location.room && findChildren(location.room).length > 0 && (
          <Select
            value={location.level}
            onValueChange={(value) =>
              setLocation({ ...location, level: value, aisle: "", row: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(location.room).map((level) => (
                <SelectItem key={level.location_id} value={level.location_id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {location.level && findChildren(location.level).length > 0 && (
          <Select
            value={location.aisle}
            onValueChange={(value) =>
              setLocation({ ...location, aisle: value, row: "" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Aisle" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(location.level).map((aisle) => (
                <SelectItem key={aisle.location_id} value={aisle.location_id}>
                  {aisle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        {location.aisle && findChildren(location.aisle).length > 0 && (
          <Select
            value={location.row}
            onValueChange={(value) => setLocation({ ...location, row: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Row" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(location.aisle).map((row) => (
                <SelectItem key={row.location_id} value={row.location_id}>
                  {row.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="flex min-h-[calc(100svh-8rem)] w-full">
      <div className="flex-1 p-6">
        <Card className="h-full">
          <CardContent className="p-6 h-full">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">
                Box {nextBoxId !== null ? nextBoxId : "XXX"}
              </h2>
              <div className="space-y-1">
                {locationDisplay}
                <p className="text-sm">Contents:</p>
              </div>
            </div>
            <div className="w-full h-[calc(100%-100px)] border-2 border-dashed border-gray-200 rounded-lg p-4 overflow-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="mb-2 p-2 bg-gray-50 rounded flex items-center space-x-3 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 text-gray-500">
                    {getItemIcon(item.category_id)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {categories?.find((cat) => cat.category_id === item.category_id)?.name}
                      </p>
                      <span className="text-sm text-gray-500 font-medium">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {sizes?.find((s) => s.size_id === item.size_id)?.name} • {item.gender}
                    </p>
                  </div>
                </div>
              ))}            
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-96 border-l bg-white p-6 space-y-6">
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {leafCategories?.map((category) => (
                  <SelectItem
                    key={category.category_id}
                    value={category.category_id}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sizeId} onValueChange={setSizeId}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {sizes?.map((size) => (
                  <SelectItem key={size.size_id} value={size.size_id}>
                    {size.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gender} onValueChange={(val) => setGender(val as GenderEnum)}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                {["Male", "Female", "Unisex", "Kids"].map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm">Quantity:</span>
              <Input
                type="number"
                className="w-24"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              />
            </div>

            <Button
              className="w-full"
              onClick={handleAdd}
              disabled={!categoryId || !sizeId || !gender}
            >
              Add
            </Button>
          </CardContent>
        </Card>

        {levelSelectorCard}

        <Button
          className="w-full"
          onClick={() => saveBoxMutation.mutate()}
          disabled={items.length === 0 || saveBoxMutation.isPending}
        >
          {saveBoxMutation.isPending ? "Saving..." : "Done (Prints label)"}
        </Button>
      </div>
    </div>
  );
};

export default AddBox;
