import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Location } from '@/types/location';
import TreeSelect from '@/components/tree-select';
import { Button } from '@/components/ui/button';

export const locationFormSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
    description: z.string().max(500, 'Description must not exceed 500 characters').nullable(),
    parent_id: z.number().nullable(),
    level: z.number().min(1).max(10, 'Maximum nesting level exceeded'),
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;

// Props interface with explicit types
interface CreateLocationFormProps {
    locations: ReadonlyArray<Location>;
    onSubmit: (values: LocationFormValues) => Promise<void>;
    initialData?: Location | null;
    isLoading: boolean;
}

export const CreateLocationForm = ({
    locations,
    onSubmit,
    initialData,
    isLoading,
}: CreateLocationFormProps): JSX.Element => {
    const form = useForm<LocationFormValues>({
        resolver: zodResolver(locationFormSchema),
        defaultValues: {
            name: initialData?.name ?? '',
            description: initialData?.description ?? null,
            parent_id: initialData?.parent_id ?? null,
            level: initialData?.level ?? 1,
        },
    });

    const handleParentSelect = (parentId: number | null): void => {
        const parentLocation = parentId
            ? locations.find(location => location.location_id === parentId)
            : null;

        const newLevel = parentLocation ? parentLocation.level + 1 : 1;

        form.setValue('parent_id', parentId);
        form.setValue('level', newLevel);
    };

    const handleSubmit = async (data: LocationFormValues): Promise<void> => {
        try {
            await onSubmit(data);
            form.reset(); // Reset form after successful submission
        } catch (error) {
            // Let the parent component handle the error
            throw error;
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
                // Prevent double submission
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
                        e.preventDefault();
                    }
                }}
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter location name"
                                    disabled={isLoading}
                                    maxLength={100}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder="Enter description"
                                    disabled={isLoading}
                                    maxLength={500}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="parent_id"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parent Location (Optional)</FormLabel>
                            <FormControl>
                                <TreeSelect
                                    items={locations}
                                    selectedId={field.value}
                                    onSelect={handleParentSelect}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    disabled={isLoading || !form.formState.isDirty}
                    className="w-full"
                >
                    {isLoading
                        ? 'Saving...'
                        : `${initialData ? 'Update' : 'Create'} Location`
                    }
                </Button>
            </form>
        </Form>
    );
};