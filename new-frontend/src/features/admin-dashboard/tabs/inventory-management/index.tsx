import React from "react";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SizeQuantity {
  size: string;
  quantity: number;
}

interface Category {
  id: string;
  name: string;
  gender: "men" | "women";
  totalQuantity: number;
  sizes: SizeQuantity[];
}

const InventoryDashboard = () => {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isAddingCategory, setIsAddingCategory] = React.useState(false);

  // Mock available categories that could come from an API
  const availableCategories = [
    {
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
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-gray-600">Manage and move around boxes</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Create Box
          </Button>
          <Button variant="outline">
            <X className="mr-2 h-4 w-4" /> Move Box(es)
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Input className="max-w-md mb-6" placeholder="Search items..." />

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeCategory(category.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded bg-blue-100" />{" "}
                {/* Placeholder icon */}
                <div>
                  <h3 className="font-semibold">
                    {category.name} ({category.gender})
                  </h3>
                  <p className="text-sm text-gray-600">
                    Quantity available: {category.totalQuantity}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {category.sizes.map((size) => (
                  <div key={size.size} className="p-3 bg-gray-50 rounded">
                    <div className="font-medium">{size.size}</div>
                    <div className="text-sm text-gray-600">{size.quantity}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Category Card */}
        <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              className="h-[300px] border-2 border-dashed border-gray-200 hover:border-gray-300 flex flex-col items-center justify-center"
            >
              <Plus className="h-8 w-8 mb-2" />
              <span>Create new category</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category to Dashboard</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Search for a category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <Button
                  key={category.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => addCategory(category as any)}
                >
                  {category.name} ({category.gender})
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

const InventoryManagement = () => {
  return (
    <>
      <InventoryDashboard />
    </>
  );
};

export default InventoryManagement;
