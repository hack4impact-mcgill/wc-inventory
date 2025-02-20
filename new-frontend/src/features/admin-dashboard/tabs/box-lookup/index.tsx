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
import SearchFilters from "@/features/admin-dashboard/components/SearchFilters";
import BoxDetails from "@/features/admin-dashboard/components/BoxDetails";

// Use the exact same interface as in BoxDetails
interface BoxItem {
  type: 'T-shirt' | 'Pants';
  gender: 'Men' | 'Women';
  size: string;
  quantity: number;
}

interface Box {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  contents: BoxItem[];
}

const InventoryDashboard = () => {
  const [selectedBoxIds, setSelectedBoxIds] = React.useState<string[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [size, setSize] = React.useState("all");
  const [gender, setGender] = React.useState("all");

  // Mock data with correct case for type and gender
  const boxes: Box[] = [
    {
      id: "25",
      name: "25",
      location: "Aisle 2 > Side B > Row 1",
      createdAt: "2024-01-20T11:30:00",
      updatedAt: "2024-01-22T09:45:00",
      contents: [
        {
          type: 'T-shirt',
          gender: 'Men',
          size: 'XL',
          quantity: 5
        },
        {
          type: 'Pants',
          gender: 'Women',
          size: 'XS',
          quantity: 3
        }
      ]
    },
    {
      id: "32",
      name: "32",
      location: "Winter inventory room",
      createdAt: "2024-01-21T11:30:00",
      updatedAt: "2024-01-23T09:45:00",
      contents: [
        {
          type: 'T-shirt',
          gender: 'Men',
          size: 'XL',
          quantity: 3
        },
        {
          type: 'Pants',
          gender: 'Women',
          size: 'XS',
          quantity: 1
        }
      ]
    }
  ];

  // Filter boxes based on search term and filters
  const filteredBoxes = React.useMemo(() => {
    return boxes.filter(box => {
      // Filter by search term (box name)
      if (searchTerm && !box.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by contents
      if (category !== 'all' || size !== 'all' || gender !== 'all') {
        return box.contents.some(item => {
          // Filter by category (item type)
          if (category !== 'all' && item.type !== (category === 'tshirts' ? 'T-shirt' : 'Pants')) {
            return false;
          }

          // Filter by size
          if (size !== 'all' && item.size !== size.toUpperCase()) {
            return false;
          }

          // Filter by gender
          if (gender !== 'all' && item.gender !== (gender === 'male' ? 'Men' : 'Women')) {
            return false;
          }

          return true;
        });
      }

      return true;
    });
  }, [boxes, searchTerm, category, size, gender]);

  const handleBoxSelect = (boxId: string) => {
    setSelectedBoxIds(prev => {
      const isSelected = prev.includes(boxId);
      if (isSelected) {
        return prev.filter(id => id !== boxId);
      } else {
        return [...prev, boxId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedBoxIds.length === filteredBoxes.length) {
      setSelectedBoxIds([]);
    } else {
      setSelectedBoxIds(filteredBoxes.map(box => box.id));
    }
  };

  const getSelectedBoxesContent = () => {
    if (selectedBoxIds.length === 0) return null;

    const selectedBoxes = boxes.filter(box => selectedBoxIds.includes(box.id));

    if (selectedBoxIds.length === 1) {
      // Single box view
      const box = selectedBoxes[0];
      return (
        <BoxDetails
          boxName={box.name}
          location={box.location}
          createdAt={box.createdAt}
          updatedAt={box.updatedAt}
          contents={box.contents}
        />
      );
    } else {
      // Multiple boxes view - sum up contents
      const combinedContents: { [key: string]: BoxItem } = {};

      selectedBoxes.forEach(box => {
        box.contents.forEach(item => {
          const key = `${item.type}-${item.gender}-${item.size}`;
          if (!combinedContents[key]) {
            combinedContents[key] = { ...item, quantity: 0 };
          }
          combinedContents[key].quantity += item.quantity;
        });
      });

      return (
        <BoxDetails
          boxName=""
          location=""
          createdAt=""
          updatedAt=""
          contents={Object.values(combinedContents)}
          isMultiSelect={true}
        />
      );
    }
  };

  const actionButtons = (
    <div className="flex gap-4">
      <Button variant="outline">Print label</Button>
      <Button variant="outline">Move</Button>
      <Button variant="outline">Donate</Button>
    </div>
  );

  id: "1",
    name: "Winter Coats",
      gender: "men",
        totalQuantity: 140,
          sizes: [
            { size: "XS", quantity: 14 },
            { size: "S", quantity: 18 },
            { size: "M", quantity: 25 },
            { size: "L", quantity: 56 },
            { size: "XL", quantity: 34 },
            { size: "XXL", quantity: 56 },
          ],
    },
    // Add more categories as needed
  ];

const filteredCategories = React.useMemo(() => {
  return searchTerm
    ? availableCategories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    : [];
}, [searchTerm]);

const addCategory = (category: Category) => {
  setCategories((prev) => [...prev, category]);
  setSearchTerm("");
  setIsAddingCategory(false);
};

const removeCategory = (categoryId: string) => {
  setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
};

return (
  // <div className="p-6">
  //   {/* Header */}
  //   <div className="flex justify-between items-center mb-6">
  //     <div>
  //       <h1 className="text-2xl font-bold">Inventory</h1>
  //       <p className="text-gray-600">Manage and move around boxes</p>
  //     </div>
  //     <div className="flex gap-4">
  //       <Button variant="outline">
  //         <Plus className="mr-2 h-4 w-4" /> Create Box
  //       </Button>
  //       <Button variant="outline">
  //         <X className="mr-2 h-4 w-4" /> Move Box(es)
  //       </Button>
  //     </div>
  //   </div>

  //   {/* Search Bar */}
  //   <Input className="max-w-md mb-6" placeholder="Search items..." />

  //   {/* Categories Grid */}
  //   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //     {categories.map((category) => (
  //       <Card key={category.id} className="relative">
  //         <Button
  //           variant="ghost"
  //           size="icon"
  //           className="absolute top-2 right-2"
  //           onClick={() => removeCategory(category.id)}
  //         >
  //           <X className="h-4 w-4" />
  //         </Button>
  //         <CardContent className="pt-6">
  //           <div className="flex items-start gap-4">
  //             <div className="h-12 w-12 rounded bg-blue-100" />{" "}
  //             {/* Placeholder icon */}
  //             <div>
  //               <h3 className="font-semibold">
  //                 {category.name} ({category.gender})
  //               </h3>
  //               <p className="text-sm text-gray-600">
  //                 Quantity available: {category.totalQuantity}
  //               </p>
  //             </div>
  //           </div>
  //           <div className="grid grid-cols-3 gap-4 mt-4">
  //             {category.sizes.map((size) => (
  //               <div key={size.size} className="p-3 bg-gray-50 rounded">
  //                 <div className="font-medium">{size.size}</div>
  //                 <div className="text-sm text-gray-600">{size.quantity}</div>
  //               </div>
  //             ))}
  //           </div>
  //         </CardContent>
  //       </Card>
  //     ))}

  //     {/* Add Category Card */}
  //     <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
  //       <DialogTrigger asChild>
  //         <Button
  //           variant="ghost"
  //           className="h-[300px] border-2 border-dashed border-gray-200 hover:border-gray-300 flex flex-col items-center justify-center"
  //         >
  //           <Plus className="h-8 w-8 mb-2" />
  //           <span>Create new category</span>
  //         </Button>
  //       </DialogTrigger>
  //       <DialogContent>
  //         <DialogHeader>
  //           <DialogTitle>Add Category to Dashboard</DialogTitle>
  //         </DialogHeader>
  //         <Input
  //           placeholder="Search for a category..."
  //           value={searchTerm}
  //           onChange={(e) => setSearchTerm(e.target.value)}
  //           className="mb-4"
  //         />
  //         <div className="space-y-2">
  //           {filteredCategories.map((category) => (
  //             <Button
  //               key={category.id}
  //               variant="outline"
  //               className="w-full justify-start"
  //               onClick={() => addCategory(category as any)}
  //             >
  //               {category.name} ({category.gender})
  //             </Button>
  //           ))}
  //         </div>
  //       </DialogContent>
  //     </Dialog>
  //   </div>
  // </div>
  <></>
);
};

const BoxLookup = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory Management</h1>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <SearchFilters
            onSearch={setSearchTerm}
            onCategoryChange={setCategory}
            onSizeChange={setSize}
            onGenderChange={setGender}
            actionButtons={actionButtons}
          />

          <Card className="mt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedBoxIds.length === filteredBoxes.length && filteredBoxes.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Box name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBoxes.map((box) => (
                  <TableRow key={box.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedBoxIds.includes(box.id)}
                        onCheckedChange={() => handleBoxSelect(box.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => handleBoxSelect(box.id)}
                        className="font-medium hover:underline"
                      >
                        Box {box.name}
                      </button>
                    </TableCell>
                    <TableCell>{box.location}</TableCell>
                    <TableCell>
                      Qty: {box.contents.reduce((sum, item) => sum + item.quantity, 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Right panel for box details */}
        <div className="w-96">
          {getSelectedBoxesContent()}
        </div>
      </div>
    </div>
  );
};

export default InventoryDashboard;
<>
  <InventoryDashboard />
</>
  );
};

export default BoxLookup;
