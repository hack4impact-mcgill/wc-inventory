import { z } from 'zod';
import { useForm, useFormState } from 'react-hook-form';
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
import { useCallback, useEffect } from 'react';

export const locationFormSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    description: z.string()
        .max(500, 'Description must not exceed 500 characters')
        .nullable()
        .transform(val => val === '' ? null : val),
    parent_id: z.number().nullable(),
    level: z.number()
        .min(1, 'Level must be at least 1')
        .max(10, 'Maximum nesting level exceeded'),
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;

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
        mode: 'onChange', // Enable validation on change
    });

    const { control, handleSubmit, setValue, formState } = form;

    // Memoize the parent selection handler
    const handleParentSelect = useCallback((parentId: number | null): void => {
        const parentLocation = parentId
            ? locations.find(location => location.location_id === parentId)
            : null;

        // Prevent selecting self as parent
        if (parentId === initialData?.location_id) {
            return;
        }

        // Calculate new level based on parent
        const newLevel = parentLocation ? parentLocation.level + 1 : 1;

        // Use batch updates to prevent unnecessary re-renders
        setValue('parent_id', parentId, { shouldValidate: true });
        setValue('level', newLevel, { shouldValidate: true });
    }, [locations, setValue, initialData]);

    // Form submission handler with proper error handling
    const onFormSubmit = async (data: LocationFormValues): Promise<void> => {
        try {
            await onSubmit(data);
            form.reset(data); // Reset form state but keep values
        } catch (error) {
            // Re-enable the form
            form.reset(data, {
                keepValues: true,
                keepDirty: true,
                keepErrors: true,
            });
            throw error;
        }
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent) => {
        // Prevent form submission on enter in input fields
        if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
            e.preventDefault();
        }

        // Allow enter key in textarea (if you add one later)
        if (e.key === 'Enter' && e.target instanceof HTMLTextAreaElement) {
            return;
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onFormSubmit)}
                className="space-y-4"
                onKeyDown={handleKeyDown}
            >
                <FormField
                    control={control}
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
                                    // Trim whitespace on blur
                                    onBlur={(e) => {
                                        field.onBlur();
                                        setValue('name', e.target.value.trim(), {
                                            shouldValidate: true,
                                        });
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
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
                                    // Trim whitespace on blur
                                    onBlur={(e) => {
                                        field.onBlur();
                                        setValue('description', e.target.value.trim() || null, {
                                            shouldValidate: true,
                                        });
                                    }}
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
                                    onSelect={(id) => {
                                        field.onChange(id);
                                        const parent = id ? locations.find(loc => loc.location_id === id) : null;
                                        form.setValue('level', parent ? parent.level + 1 : 1);
                                    }}
                                    disabled={isLoading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    disabled={isLoading || !formState.isDirty || !formState.isValid}
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