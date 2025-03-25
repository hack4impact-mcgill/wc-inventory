import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import IconSelector from "@/components/icon-selector";
import { Category, CategoryFormData } from "@/types/category";
import { type CategoryIconName } from "@/types/icons";

export interface CategoryFormProps {
  categories: ReadonlyArray<Category>;
  onSubmit: (values: CategoryFormData) => Promise<void>;
  initialData?: Category | null;
  isLoading: boolean;
  onClose: () => void;
}

const CategoryForm: FC<CategoryFormProps> = (
  { categories, onSubmit, initialData, isLoading, onClose },
) => {
  const [formData, setFormData] = useState<CategoryFormData>(() => ({
    name: initialData?.name || "",
    description: initialData?.description || "",
    level: initialData?.level || 1,
    icon: initialData?.icon || null, // Changed to match your IconSelector's value type
    parent_id: initialData?.parent_id || null,
  }));

  const handleClearParent = () => {
    setFormData((prev) => ({
      ...prev,
      parent_id: null,
      level: 1, // Reset to level 1 when clearing parent
    }));
    setParentSearch("");
    setShowSuggestions(false);
  };

  const [parentSearch, setParentSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Get the path to a category
  const getCategoryPath = (category: Category): string => {
    const path: string[] = [category.name];
    let currentCategory = category;

    while (currentCategory.parent_id) {
      const parent = categories.find((c) =>
        c.category_id === currentCategory.parent_id
      );
      if (!parent) break;
      path.unshift(parent.name);
      currentCategory = parent;
    }

    return path.join(" → ");
  };

  // Filter categories based on search input
  const filteredCategories = categories
    .filter((category) => {
      const path = getCategoryPath(category);
      return path.toLowerCase().includes(parentSearch.toLowerCase());
    })
    .slice(0, 5);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleParentSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParentSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelectParent = (category: Category) => {
    setFormData((prev) => ({
      ...prev,
      parent_id: category.category_id,
      level: (category.level || 0) + 1,
    }));
    setParentSearch(getCategoryPath(category));
    setShowSuggestions(false);
  };

  // Updated to match your IconSelector's onChange type
  const handleIconChange = (newIcon: CategoryIconName) => {
    setFormData((prev) => ({
      ...prev,
      icon: newIcon,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Set initial parent search value if editing
  useEffect(() => {
    if (initialData?.parent_id) {
      const parent = categories.find((c) =>
        c.category_id === initialData.parent_id
      );
      if (parent) {
        setParentSearch(getCategoryPath(parent));
      }
    }
  }, [initialData, categories]);

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      <div className="flex items-center gap-4">
        <label
          htmlFor="icon"
          className="text-gray-700 font-medium w-24 flex-shrink-0"
        >
          Icon:
        </label>
        <div className="flex-1">
          <IconSelector
            value={formData.icon}
            onChange={handleIconChange}
            className="w-full"
          />
        </div>
      </div>

      <div className="grid gap-2">
        <label htmlFor="name" className="text-gray-700 font-medium">
          Name:
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Category Name"
          maxLength={100}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="description" className="text-gray-700 font-medium">
          Description:
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleChange}
          placeholder="Category Description"
          className="min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />

        <div className="grid gap-2 relative">
          <label htmlFor="parent" className="text-gray-700 font-medium">
            Parent Category (Optional):
          </label>
          <Input
            id="parent"
            value={parentSearch}
            onChange={handleParentSearch}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for parent category..."
          />
          {parentSearch && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClearParent}
              className="shrink-0"
            >
              Clear Parent Category
            </Button>
          )}
        </div>
        {showSuggestions && parentSearch && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border border-gray-200 shadow-lg z-10">
            {filteredCategories.length > 0
              ? (
                <div className="py-1">
                  {filteredCategories.map((category) => (
                    <div
                      key={category.category_id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleSelectParent(category)}
                    >
                      {getCategoryPath(category)}
                    </div>
                  ))}
                </div>
              )
              : (
                <div className="px-3 py-2 text-gray-500">
                  No categories found
                </div>
              )}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-black text-white hover:bg-gray-800"
          disabled={isLoading}
        >
          {initialData ? "Update" : "Add"} Category
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
