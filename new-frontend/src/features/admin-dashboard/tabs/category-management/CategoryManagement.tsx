//CategoryManagement

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "@/lib/api";
import type { Category, CategoryFormProps } from "@/types/category";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import CategoryForm from "./components/category-form";
import CategoriesTable from "./components/category-table";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {Toaster} from "@/components/ui/toaster.tsx";



const CategoryManagement = () => {
    const queryClient = useQueryClient();
    const [globalFilter, setGlobalFilter] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { data: categories = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: fetchCategories,
    });

    const createMutation = useMutation({
        mutationFn: createCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsDialogOpen(false);
            setSelectedCategory(null);
            toast({
                title: "Success",
                description: "Category created successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to create category",
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
            updateCategory(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            setIsDialogOpen(false);
            setSelectedCategory(null);
            toast({
                title: "Success",
                description: "Category updated successfully",
            });
        },
        onError: () => {
            toast({
                title: "Error",
                description: "Failed to update category",
                variant: "destructive",
            });
        },
    });


    const handleSubmit: CategoryFormProps["onSubmit"] = async (data) => {
        try {
            if (selectedCategory) {
                await updateMutation.mutateAsync({
                    id: selectedCategory.category_id,
                    data,
                });
            } else {
                await createMutation.mutateAsync(data);
            }
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleDelete = (id: string) => {
        // Check if the category has any children
        const hasChildren = categories.some(category => category.parent_id === id);

        if (hasChildren) {
            toast({
                title: "Cannot Delete",
                description: "This category has sub-categories. Please delete or reassign them first.",
                variant: "destructive"
            });
            return;
        }

        if (window.confirm("Are you sure you want to delete this category?")) {
            deleteMutation.mutate(id);
        }
    };

// Update the deleteMutation to handle the error more gracefully
    const deleteMutation = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Success",
                description: "Category deleted successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error instanceof Error
                    ? error.message
                    : "Failed to delete category. It may have dependent sub-categories.",
                variant: "destructive",
            });
        },
    });

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedCategory(null);
    };

    const handleEdit = () => (category: Category) => {
        setSelectedCategory(category);  // Update selectedCategory to the full Category
        setIsDialogOpen(true);  // Open the dialog to edit
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="relative max-w-sm">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search categories..."
                                value={globalFilter}
                                onChange={(e) => setGlobalFilter(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Category
                        </Button>
                    </div>

                    <CategoriesTable
                        data={categories}
                        filter={globalFilter}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>
            <Dialog open={isDialogOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedCategory ? "Edit Category" : "Create New Category"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedCategory
                                ? "Edit the details of the existing category"
                                : "Add a new category to the system"}
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                        categories={categories.filter(
                            (category) => category.category_id !== selectedCategory?.category_id
                        )}
                        onSubmit={handleSubmit}
                        initialData={selectedCategory}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        onClose={handleClose}
                    />
                </DialogContent>
            </Dialog>
            <Toaster/>
        </>
    );
};

export default CategoryManagement;

