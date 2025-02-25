import { useState } from "react";
import { Size } from "@/types/size";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSizes } from "./hooks/use-sizes";
import { SizeTable } from "./components/size-table";
import SizeForm from "./components/size-form";
import { sizeApi } from "@/lib/api/sizes";

const SizeManagement = () => {
    const {
        sizes,
        isLoading,
        createMutation,
        updateMutation,
        deleteMutation
    } = useSizes();

    const [filter, setFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string | undefined>();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState<Size | null>(null);
    const [updateConfirmation, setUpdateConfirmation] = useState<{
        show: boolean;
        size: Size | null;
        newData: any;
        usageCount: number;
    }>({
        show: false,
        size: null,
        newData: null,
        usageCount: 0
    });

    const handleSubmit = async (data: any) => {
        try {
            if (selectedSize) {
                // Check if size is in use
                const usageCount = await sizeApi.checkSizeUsage(selectedSize.size_id);
                if (usageCount > 0) {
                    setUpdateConfirmation({
                        show: true,
                        size: selectedSize,
                        newData: data,
                        usageCount
                    });
                    return;
                }
                // If not in use, proceed with update
                await updateMutation.mutateAsync({
                    id: selectedSize.size_id,
                    data,
                });
            } else {
                await createMutation.mutateAsync(data);
            }
            handleClose();
        } catch (error) {
            console.error('Form submission error:', error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteMutation.mutateAsync(id);
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete size",
                variant: "destructive"
            });
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedSize(null);
    };

    const handleEdit = (size: Size) => {
        setSelectedSize(size);
        setIsDialogOpen(true);
    };

    const handleUpdateConfirm = async () => {
        if (updateConfirmation.size && updateConfirmation.newData) {
            try {
                await updateMutation.mutateAsync({
                    id: updateConfirmation.size.size_id,
                    data: updateConfirmation.newData
                });
                handleClose();
            } catch (error) {
                console.error('Error updating size:', error);
            }
        }
        setUpdateConfirmation({ show: false, size: null, newData: null, usageCount: 0 });
    };

    const filteredSizes = sizes.filter(size =>
        size.name.toLowerCase().includes(filter.toLowerCase()) ||
        size.category.toLowerCase().includes(filter.toLowerCase()) ||
        size.region.toLowerCase().includes(filter.toLowerCase()) ||
        size.gender.toLowerCase().includes(filter.toLowerCase())
    );

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search sizes..."
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="pl-8 w-[300px]"
                                />
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline">
                                        {categoryFilter || "All Categories"}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setCategoryFilter(undefined)}>
                                        All Categories
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCategoryFilter("Adult")}>
                                        Adult Sizes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCategoryFilter("Kid")}>
                                        Kid Sizes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setCategoryFilter("Shoe")}>
                                        Shoe Sizes
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <Button onClick={() => setIsDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Size
                        </Button>
                    </div>

                    <SizeTable
                        sizes={filteredSizes}
                        categoryFilter={categoryFilter}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedSize ? "Edit Size" : "Create New Size"}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedSize
                                ? "Edit the details of the existing size"
                                : "Add a new size to the system"}
                        </DialogDescription>
                    </DialogHeader>
                    <SizeForm
                        initialData={selectedSize!}
                        onSubmit={handleSubmit}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                        onClose={handleClose}
                    />
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={updateConfirmation.show}
                onOpenChange={(open) => !open && setUpdateConfirmation({
                    show: false,
                    size: null,
                    newData: null,
                    usageCount: 0
                })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Size Update</AlertDialogTitle>
                        <AlertDialogDescription>
                            This size is currently assigned to {updateConfirmation.usageCount} items in the inventory.
                            Updating this size will affect all these items. Are you sure you want to proceed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default SizeManagement;