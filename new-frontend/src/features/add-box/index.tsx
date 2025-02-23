import { useState, useEffect, SetStateAction } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { fetchLocations } from "@/lib/api";
import { queryKeys } from "@/lib/api/queryKeys";
import { 
  TShirt, 
  Pants, 
  Dress, 
  Sneaker,  
  Package 
} from "@phosphor-icons/react";


interface BoxLocation {
  room: string;
  level: string;
  aisle: string;
  row: string;
}

interface BoxItem {
  category: string;
  size: string;
  gender: string;
  quantity: number;
}

interface Category {
  category_id: string;
  name: string;
  description: string | null;
  level: number;
  parent_id: string | null;
}

interface LocationNode {
  location_id: string;
  name: string;
  description: string | null;
  level: number | null;
  parent_id: string | null;
  children: LocationNode[];
}

const buildLocationTree = (locations: LocationNode[]): LocationNode[] => {
  const locationMap = new Map<string, LocationNode>();
  const rootNodes: LocationNode[] = [];

  // First, create all nodes with empty children arrays
  locations.forEach(location => {
    locationMap.set(location.location_id, { ...location, children: [] });
  });

  // Then, build the tree structure
  locations.forEach(location => {
    const node = locationMap.get(location.location_id)!;
    if (location.parent_id === null) {
      rootNodes.push(node);
    } else {
      const parentNode = locationMap.get(location.parent_id);
      if (parentNode) {
        parentNode.children.push(node);
      }
    }
  });

  return rootNodes;
};

const AddBox = () => {
  const [items, setItems] = useState<BoxItem[]>([]);
  const [category, setCategory] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [location, setLocation] = useState<BoxLocation>({
    room: "",
    level: "",
    aisle: "",
    row: "",
  });
  const [locationTree, setLocationTree] = useState<LocationNode[]>([]);
  const [boxNumber, setBoxNumber] = useState<number | null>(null);

  const { data: locations, isLoading } = useQuery({
    queryFn: async () => {
      const fetchedLocations = await fetchLocations();
      return fetchedLocations;
    },
    queryKey: queryKeys.locations.all,
  });

  const { data: boxCount } = useQuery({
    queryFn: async () => {
      const { count } = await supabase
        .from('boxes')
        .select('*', { count: 'exact', head: true });
      return (count || 0) + 1;
    },
    queryKey: ['boxCount']
  });

  useEffect(() => {
    if (boxCount) {
      setBoxNumber(boxCount);
    }
  }, [boxCount]);

  useEffect(() => {
    if (locations) {
      const locationsWithChildren = locations.map(loc => ({ ...loc, children: [] }));
      const tree = buildLocationTree(locationsWithChildren);
      setLocationTree(tree);
      console.log('Location Tree:', JSON.stringify(tree, null, 2));
    }
  }, [locations]);

  const handleAdd = () => {
    if (!category || !size || !gender) return;
    
    const newItem: BoxItem = {
      category,
      size,
      gender,
      quantity
    };
    
    setItems([...items, newItem]);
    
    // Reset form
    setCategory("");
    setSize("");
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
      return '';
    };
    
    return findNodeName(locationTree);
  };

  const locationDisplay = (
    <p className="text-sm">
      Location: {location.room && getLocationName(location.room)}
      {location.level && `, ${getLocationName(location.level)}`}
      {location.aisle && `, ${getLocationName(location.aisle)}`}
      {location.row && `, ${getLocationName(location.row)}`}
    </p>
  );

  const findChildren = (parentId: string | null) => {
    if (!locationTree) return [];
    
    // If looking for root nodes
    if (parentId === null) {
      return locationTree;
    }
    
    // Find the parent node
    const findNode = (nodes: LocationNode[]): LocationNode | null => {
      for (const node of nodes) {
        if (node.location_id === parentId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };
    
    const parentNode = findNode(locationTree);
    return parentNode?.children || [];
  };

  const levelSelectorCard = (
    <Card className="shadow-sm">
      <CardContent className="p-6 space-y-4">
        {/* Room selector - only show if there are root nodes */}
        {findChildren(null).length > 0 && (
          <Select 
            value={location.room} 
            onValueChange={(value) => setLocation({ 
              ...location, 
              room: value,
              level: "",
              aisle: "",
              row: "" 
            })}
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

        {/* Level selector - only show if room is selected and has children */}
        {location.room && findChildren(location.room).length > 0 && (
          <Select 
            value={location.level} 
            onValueChange={(value) => setLocation({ 
              ...location, 
              level: value,
              aisle: "",
              row: "" 
            })}
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

        {/* Aisle selector - only show if level is selected and has children */}
        {location.level && findChildren(location.level).length > 0 && (
          <Select 
            value={location.aisle} 
            onValueChange={(value) => setLocation({ 
              ...location, 
              aisle: value,
              row: "" 
            })}
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

        {/* Row selector - only show if aisle is selected and has children */}
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

  // Replace the existing getItemIcon function
  const getItemIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'shirt':
      case 'tshirt':
      case 't-shirt':
      case 'top':
        return <TShirt weight="duotone" size={20} />;
      case 'pants':
      case 'jeans':
      case 'trousers':
        return <Pants weight="duotone"size={20} />;
      case 'dress':
      case 'skirt':
        return <Dress weight="duotone" size={20} />;
      case 'jacket':
      case 'coat':
      case 'sweater':
        return <TShirt weight="duotone" size={20} />;
      case 'shoes':
      case 'sneakers':
        return <Sneaker weight="duotone"size={20} />;
      case 'socks':
      case 'stockings':
        return <Sneaker weight="duotone" size={20} />;
      default:
        return <Package weight="duotone" size={20} />;
    }
  };

  return (
    <div className="flex h-screen w-full ">
      {/* Left side - Preview Area */}
      <div className="flex-1 p-6">
        <Card className="h-full">
          <CardContent className="p-6 h-full">
            <div className="space-y-2 mb-6">
              <h2 className="text-2xl font-bold">
                Box {boxNumber ? String(boxNumber).padStart(3, '0') : 'XXX'}
              </h2>
              <div className="space-y-1">
                {locationDisplay}
                <p className="text-sm">Contents:</p>
              </div>
            </div>
            
            {/* Content Preview Area */}
            <div className="w-full h-[calc(100%-100px)] border-2 border-dashed border-gray-200 rounded-lg p-4 overflow-auto">
              {items.map((item, index) => (
                <div key={index} className="mb-2 p-2 bg-gray-50 rounded flex items-center space-x-3 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 text-gray-500">
                    {getItemIcon(item.category)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">
                        {item.category}
                      </p>
                      <span className="text-sm text-gray-500 font-medium">
                        x{item.quantity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {item.size} • {item.gender}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Right side - Controls */}
      <div className="w-96 border-l bg-white p-6 space-y-6">
        {/* Control panel */}
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="category1">Category 1</SelectItem>
                <SelectItem value="category2">Category 2</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={size} onValueChange={setSize}>
              <SelectTrigger>
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="unisex">Unisex</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-2">
              <span className="text-sm">Quantity:</span>
              <Input 
                type="number" 
                className="w-24"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>
            
            <Button className="w-full" onClick={handleAdd}>
              Add
            </Button>
          </CardContent>
        </Card>
        
        {/* Level selector */}
        {levelSelectorCard}
        
        {/* Done button */}
        <Button className="w-full">
          Done (Prints label)
        </Button>
      </div>
    </div>
  );
};

export default AddBox;