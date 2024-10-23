import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLocations, createLocation, updateLocation, deleteLocation } from '@/lib/api';
import { Location } from '@/types/location';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';
import { CreateLocationForm } from './components/create-location-form';
import { LocationTable } from './components/location-table';

const LocationManagement = () => {
    const queryClient = useQueryClient();
    const [globalFilter, setGlobalFilter] = React.useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const { data: locations = [], isLoading } = useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });

    const createMutation = useMutation({
        mutationFn: createLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            setIsDialogOpen(false);
            setSelectedLocation(null);
            toast({
                title: "Success",
                description: "Location created successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to create location",
                variant: "destructive",
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: Partial<Location> }) =>
            updateLocation(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            setIsDialogOpen(false);
            setSelectedLocation(null);
            toast({
                title: "Success",
                description: "Location updated successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to update location",
                variant: "destructive",
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['locations'] });
            toast({
                title: "Success",
                description: "Location deleted successfully",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: "Failed to delete location",
                variant: "destructive",
            });
        },
    });

    const handleSubmit = async (data: Omit<Location, 'location_id'>) => {
        if (selectedLocation) {
            await updateMutation.mutateAsync({
                id: selectedLocation.location_id,
                data
            });
        } else {
            await createMutation.mutateAsync(data);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this location?')) {
            await deleteMutation.mutateAsync(id);
        }
    };

    const handleClose = () => {
        setIsDialogOpen(false);
        setSelectedLocation(null);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <>
            <Card>
                <CardContent className="pt-6">
                    <LocationTable
                        locations={locations}
                        onEdit={(location) => {
                            setSelectedLocation(location);
                            setIsDialogOpen(true);
                        }}
                        onDelete={handleDelete}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        onAdd={() => setIsDialogOpen(true)}
                    />
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedLocation ? 'Edit Location' : 'Create New Location'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedLocation
                                ? 'Edit the details of the existing location'
                                : 'Add a new location to the system'}
                        </DialogDescription>
                    </DialogHeader>
                    <CreateLocationForm
                        locations={locations}
                        onSubmit={handleSubmit}
                        initialData={selectedLocation}
                        isLoading={createMutation.isPending || updateMutation.isPending}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LocationManagement;