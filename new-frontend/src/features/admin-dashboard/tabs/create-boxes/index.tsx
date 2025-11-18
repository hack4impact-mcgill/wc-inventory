import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Tables, Enums } from "@/types/supabase";
import { GenderEnum } from "@/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildLocationTree } from "./utils";

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

interface CreateBoxItem {
  box_id?: string | null;
  box_name: string;
  category_id: string;
  quantity: number;
  gender: string;
  size_id?: string | null;
  location_id?: string | null;
}

const CreateBox: React.FC = () => {
  const [categories, setCategories] = useState<Tables<'categories'>[]>([]);
  const [sizes, setSizes] = useState<Tables<'sizes'>[]>([]);
  const [existingBoxes, setExistingBoxes] = useState<Tables<'boxes'>[]>([]);
  const [locations, setLocations] = useState<Tables<'locations'>[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<string>("");
  const [gender, setGender] = useState<GenderEnum | "">("");
  const [sizeId, setSizeId] = useState<string>("");
  const [tempLocation, setTempLocation] = useState({
    room: "",
    level: "",
    aisle: "",
    row: "",
  });
  const [createBoxItems, setCreateBoxItems] = useState<CreateBoxItem[]>([
    { 
      box_id: null,
      box_name: '',
      category_id: '',
      quantity: 0,
      gender: 'Unisex',
      size_id: null,
      location_id: null
    }
  ]);
  const getNextBoxName = () => {
    const numbers = existingBoxes
      .map(b => parseInt(b.name.replace(/\D/g, ""), 10))
      .filter(n => !isNaN(n));

    const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

    return `Box ${nextNum}`;
  };

  const handleNewBoxSelection = (index: number) => {
    const newBoxName = getNextBoxName();
    updateCreateBoxItem(index, { 
      box_id: null,
      box_name: newBoxName 
    });
  };

  const locationTree = locations
    ? buildLocationTree(locations.map((loc) => ({ ...loc, children: [] })))
    : [];

  // Filter out any parent categories
  const leafCategories = categories?.filter((category) =>
    !categories.some((c) => c.parent_id === category.category_id)
  );

  const findChildren = (parentId: string | null) => {
    if (!locationTree.length) return [];

    if (!parentId) return locationTree;

    const findNode = (nodes) => {
      for (const node of nodes) {
        if (node.location_id === parentId) return node;
        const found = findNode(node.children);
        if (found) return found;
      }
      return null;
    };

    return findNode(locationTree)?.children || [];
  };

  const filteredSizes = sizes?.filter((s) => {
    if (!categoryId) return false;
    
    const matchesCategory = s.category === categoryId;
    const matchesGender =
      !s.gender || s.gender === gender || s.gender === "Unisex";

    return matchesCategory && matchesGender;
  });

  const getLocationPath = (locationId: string | null) => {
    if (!locationId) return "";

    let path = [];
    let curr = locations.find((l) => l.location_id === locationId);

    while (curr) {
      path.unshift(curr.name);
      curr = locations.find((l) => l.location_id === curr.parent_id);
    }

    return path.join(" > ");
  };

  const LocationSelector = () => (
    <Card className="shadow-sm mt-4">
      <CardContent className="p-6 space-y-4">
        <p className="font-semibold">Location</p>

        {/* ROOM */}
        {findChildren(null).length > 0 && (
          <Select
            value={tempLocation.room}
            onValueChange={(value) =>
              setTempLocation({
                room: value,
                level: "",
                aisle: "",
                row: "",
              })
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

        {/* LEVEL */}
        {tempLocation.room && findChildren(tempLocation.room).length > 0 && (
          <Select
            value={tempLocation.level}
            onValueChange={(value) =>
              setTempLocation({
                ...tempLocation,
                level: value,
                aisle: "",
                row: "",
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {findChildren(tempLocation.room).map((level) => (
                <SelectItem key={level.location_id} value={level.location_id}>
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* AISLE */}
        {tempLocation.level &&
          findChildren(tempLocation.level).length > 0 && (
            <Select
              value={tempLocation.aisle}
              onValueChange={(value) =>
                setTempLocation({
                  ...tempLocation,
                  aisle: value,
                  row: "",
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Aisle" />
              </SelectTrigger>
              <SelectContent>
                {findChildren(tempLocation.level).map((aisle) => (
                  <SelectItem key={aisle.location_id} value={aisle.location_id}>
                    {aisle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

        {/* ROW */}
        {tempLocation.aisle &&
          findChildren(tempLocation.aisle).length > 0 && (
            <Select
              value={tempLocation.row}
              onValueChange={(value) =>
                setTempLocation({
                  ...tempLocation,
                  row: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Row" />
              </SelectTrigger>
              <SelectContent>
                {findChildren(tempLocation.aisle).map((row) => (
                  <SelectItem key={row.location_id} value={row.location_id}>
                    {row.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

        {/* Save button */}
        <Button
          className="w-full"
          onClick={() => {
            const finalLocation =
              tempLocation.row ||
              tempLocation.aisle ||
              tempLocation.level ||
              tempLocation.room;

            updateCreateBoxItem(activeRowIndex!, {
              location_id: finalLocation,
            });

            setShowLocationModal(false);
          }}
        >
          Save Location
        </Button>
      </CardContent>
    </Card>
  );

  const getSizeCategoryForItem = (categoryId: string) => {
    const category = categories.find(c => c.category_id === categoryId);
    if (!category) return null;
    
    if (category.name.toLowerCase().includes('shoe')) return 'Shoe';
    if (category.name.toLowerCase().includes('kid') || category.name.toLowerCase().includes('child')) return 'Kid';
    return 'Adult';
  };

    const filterSizesForItem = (item: CreateBoxItem) => {
    if (!item.category_id) return [];
    const expectedCategory = getSizeCategoryForItem(item.category_id);
    if (!expectedCategory) return [];

    return sizes.filter((s) => {
      const matchesCategory = s.category === expectedCategory;
      const matchesGender = !s.gender || s.gender === item.gender || s.gender === "Unisex";
      return matchesCategory && matchesGender;
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      const { data: sizesData, error: sizesError } = await supabase
        .from('sizes')
        .select('*');

      const { data: boxesData, error: boxesError } = await supabase
        .from('boxes')
        .select('*');

      const { data: locationsData, error: locationsError } = await supabase
        .from('locations')
        .select('*');

      if (categoriesError) {
        console.error('Error fetching categories:', categoriesError);
      }

      if (sizesError) {
        console.error('Error fetching sizes:', sizesError);
      }

      if (boxesError) {
        console.error('Error fetching boxes:', boxesError);
      }

      if (locationsError) {
        console.error('Error fetching locations:', locationsError);
      }

      setCategories(categoriesData || []);
      setSizes(sizesData || []);
      setExistingBoxes(boxesData || []);
      setLocations(locationsData || []);
    };

    fetchData();
  }, []);

    useEffect(() => {
    setSizeId("");
  }, [categoryId, gender]);

  const updateCreateBoxItem = (index: number, updates: Partial<CreateBoxItem>) => {
    const newItems = [...createBoxItems];
    newItems[index] = { ...newItems[index], ...updates };
    setCreateBoxItems(newItems);
  };

  const addNewItemRow = () => {
    setCreateBoxItems([
      ...createBoxItems,
      {
        box_id: null,
        box_name: '',
        category_id: '',
        quantity: 0,
        gender: 'Unisex',
        size_id: null,
        location_id: null
      }
    ]);
  };

  const [error, setError] = useState("");
  const handleCreateBox = async () => {

    const hasEmptyFields = createBoxItems.filter(item =>
      !(item.box_id || item.box_name) ||
      !item.category_id ||
      !item.quantity
      ||!item.gender ||
      !item.location_id
      ||!item.size_id);

    if (hasEmptyFields.length > 0) {
      setError("Please fill out all required fields before continuing.");
      return;
    }

    setError("");

    const boxesToCreate = createBoxItems.filter(item => 
      (item.box_id || item.box_name) && 
      item.category_id && 
      item.quantity > 0
    );
  
    try {
      for (const item of boxesToCreate) {
        let targetBoxId: string;

        if (!item.box_id) {
          const { data: newBox, error: boxError } = await supabase
            .from('boxes')
            .insert({
              name: item.box_name,
              description: `${item.quantity} items`,
              location_id: item.location_id
            })
            .select()
            .single();
  
          if (boxError) throw boxError;
          targetBoxId = newBox.box_id;
        } else {
          targetBoxId = item.box_id;
        }

        const { error: contentsError } = await supabase
          .from('box_contents')
          .insert({
            box_id: targetBoxId,
            category_id: item.category_id,
            quantity: item.quantity,
            gender: item.gender,
            size_id: item.size_id
          });
  
        if (contentsError) throw contentsError;
      }
  
      setCreateBoxItems([
        { 
          box_id: null,
          box_name: '',
          category_id: '',
          quantity: 0,
          gender: 'Unisex',
          size_id: null,
          location_id: null
        }
      ]);

      // toast.success('Box created!');

      const { data: boxesData } = await supabase.from('boxes').select('*');
      setExistingBoxes(boxesData || []);
      console.log("BOXES:", boxesData);
    } catch (error) {
      console.error('Error creating boxes:', error);
    // toast.error('Failed to create boxe');
    }

  };

  return (
    <Card className="p-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Box</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {createBoxItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="flex space-x-2 items-center">
                  <select 
                    value={item.box_id || ''}
                    onChange={(e) => {
                      const selectedBoxId = e.target.value;
                      updateCreateBoxItem(index, { 
                        box_id: selectedBoxId || null,
                        box_name: selectedBoxId ? '' : item.box_name
                      });
                    }}
                    className="w-1/2 p-2 border rounded"
                  >
                    <option value="">Select Existing Box</option>
                    {existingBoxes.map((box) => (
                      <option key={box.box_id} value={box.box_id}>
                        {box.name}
                      </option>
                    ))}
                  </select>
                  <Button
                    className="w-1/2"
                    variant="secondary"
                    onClick={() => handleNewBoxSelection(index)}
                  >
                    + New Box
                  </Button>
                </div>
                {item.box_name && (
                  <p className="text-sm text-gray-500 mt-1">
                    New: <strong>{item.box_name}</strong>
                  </p>
                )}
              </TableCell>
              <TableCell>
                <select 
                  value={item.category_id}
                  onChange={(e) => updateCreateBoxItem(index, { category_id: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Input 
                  type="number"
                  value={item.quantity === null || item.quantity === undefined ? '' : item.quantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateCreateBoxItem(index, {
                      quantity: value === '' ? '' : parseInt(value)
                    });
                  }}
                />
              </TableCell>
              <TableCell>
                <select 
                  value={item.gender}
                  onChange={(e) => updateCreateBoxItem(index, { 
                    gender: e.target.value as string 
                  })}
                  className="w-full p-2 border rounded"
                >
                  {['Male', 'Female', 'Unisex', 'Kids'].map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <Select
                  value={item.size_id || ""}
                  onValueChange={(value) => updateCreateBoxItem(index, { size_id: value })}
                  disabled={!item.category_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterSizesForItem(item).length > 0 ? (
                      filterSizesForItem(item).map((size) => (
                        <SelectItem key={size.size_id} value={size.size_id}>
                          {size.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-gray-500">
                        No sizes available for this category / gender.
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setActiveRowIndex(index);

                    const selectedId = item.location_id;
                    if (selectedId) {
                      const path: any = [];
                      let curr = locations.find((l) => l.location_id === selectedId);
                      while (curr) {
                        path.unshift(curr.location_id);
                        curr = locations.find((l) => l.location_id === curr.parent_id);
                      }

                      setTempLocation({
                        room: path[0] || "",
                        level: path[1] || "",
                        aisle: path[2] || "",
                        row: path[3] || "",
                      });
                    } else {
                      setTempLocation({ room: "", level: "", aisle: "", row: "" });
                    }

                    setShowLocationModal(true);
                  }}
                >
                  {item.location_id ? getLocationPath(item.location_id) : "Select Location"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4">
      <Button variant="outline" onClick={addNewItemRow}>
          Add Item Row
        </Button>
        <Button onClick={handleCreateBox}>
          Create/Add to boxes
        </Button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {showLocationModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-[400px] max-h-[90vh] overflow-auto p-4">
          <LocationSelector />
        </div>
      </div>
    )}
    </Card>
  );
};

export default CreateBox;
