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
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import { Tables, Enums } from "@/types/supabase";
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
              name: item.box_name || `${categories.find(c => c.category_id === item.category_id)?.name || 'Box'}-${Date.now()}`,
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
                <div className="flex space-x-2"> #Check branch 130
                  <select 
                    value={item.box_id || ''}
                    onChange={(e) => {
                      const selectedBoxId = e.target.value;
                      updateCreateBoxItem(index, { 
                        box_id: selectedBoxId ? selectedBoxId : null,
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
                  <Input 
                    placeholder="Or enter new box name"
                    value={item.box_name}
                    onChange={(e) => {
                      updateCreateBoxItem(index, { 
                        box_name: e.target.value,
                        box_id: null 
                      });
                    }}
                    className="w-1/2"
                  />
                </div>
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
                <select 
                  value={item.size_id || ''}
                  onChange={(e) => updateCreateBoxItem(index, { 
                    size_id: e.target.value || null 
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Size (Optional)</option>
                  {sizes.map((size) => (
                    <option key={size.size_id} value={size.size_id}>
                      {size.name} ({size.region})
                    </option>
                  ))}
                </select>
              </TableCell>
              <TableCell>
                <select
                  value={item.location_id || ''}
                  onChange={(e) => updateCreateBoxItem(index, {
                    location_id: e.target.value || null
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.location_id} value={location.location_id}>
                      {location.name}
                    </option>
                  ))}
                </select>
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

    </Card>
  );
};

export default CreateBox;
