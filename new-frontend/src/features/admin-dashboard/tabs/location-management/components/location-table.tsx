import React, { useState, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
    ColumnDef,
    Row,
} from '@tanstack/react-table';
import { Location } from '@/types/location';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, ChevronDown, Plus, Search, Pencil, Trash2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface LocationTableProps {
    locations: Location[];
    onEdit: (location: Location) => void;
    onDelete: (id: number) => void;
    globalFilter: string;
    setGlobalFilter: (value: string) => void;
    onAdd: () => void;
}

const columnHelper = createColumnHelper<Location>();

export const LocationTable = ({
    locations,
    onEdit,
    onDelete,
    globalFilter,
    setGlobalFilter,
    onAdd,
}: LocationTableProps) => {
    const [expanded, setExpanded] = useState<Set<number>>(new Set());

    // Organize locations into a hierarchical structure
    const hierarchicalData = useMemo(() => {
        const locationMap = new Map<number | null, Location[]>();

        // Group locations by parent_id
        locations.forEach(location => {
            const parentId = location.parent_id;
            if (!locationMap.has(parentId)) {
                locationMap.set(parentId, []);
            }
            locationMap.get(parentId)?.push(location);
        });

        // Sort locations at each level by name
        locationMap.forEach(locations => {
            locations.sort((a, b) => a.name.localeCompare(b.name));
        });

        // Function to build nested structure
        const buildHierarchy = (parentId: number | null, level: number = 0): Location[] => {
            const children = locationMap.get(parentId) || [];
            return children.map(child => ({
                ...child,
                _level: level,
                _hasChildren: (locationMap.get(child.location_id) || []).length > 0,
            }));
        };

        return buildHierarchy(null);
    }, [locations]);

    const toggleExpanded = (id: number) => {
        const newExpanded = new Set(expanded);
        if (newExpanded.has(id)) {
            // Collapse this node and all its children
            const collapseChildren = (locationId: number) => {
                newExpanded.delete(locationId);
                locations
                    .filter(loc => loc.parent_id === locationId)
                    .forEach(child => collapseChildren(child.location_id));
            };
            collapseChildren(id);
        } else {
            newExpanded.add(id);
        }
        setExpanded(newExpanded);
    };

    const columns = useMemo<ColumnDef<Location>[]>(() => [
        columnHelper.display({
            id: 'expander',
            cell: ({ row }) => {
                const location = row.original;
                const hasChildren = locations.some(loc => loc.parent_id === location.location_id);
                const level = location._level || 0;
                const paddingLeft = `${level * 2}rem`;

                return (
                    <div className="flex items-center" style={{ paddingLeft }}>
                        {hasChildren ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 hover:bg-transparent"
                                onClick={() => toggleExpanded(location.location_id)}
                            >
                                {expanded.has(location.location_id) ? (
                                    <ChevronDown className="h-4 w-4" />
                                ) : (
                                    <ChevronRight className="h-4 w-4" />
                                )}
                            </Button>
                        ) : (
                            <div className="w-6" />
                        )}
                        <span>{location.name}</span>
                    </div>
                );
            },
            header: 'Name',
        }),
        columnHelper.accessor('description', {
            header: 'Description',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('level', {
            header: 'Level',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('parent_id', {
            header: 'Parent Location',
            cell: info => {
                const parentId = info.getValue();
                if (!parentId) return '-';
                const parent = locations.find(loc => loc.location_id === parentId);
                return parent?.name || '-';
            },
        }),
        columnHelper.display({
            id: 'actions',
            header: '',
            cell: ({ row }) => (
                <div className="flex gap-2 justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(row.original)}
                        className="h-8 w-8 p-0"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(row.original.location_id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        }),
    ], [locations, expanded, onEdit, onDelete]);

    const getVisibleData = useMemo(() => {
        const result: Location[] = [];

        const addLocation = (location: Location) => {
            result.push(location);
            if (expanded.has(location.location_id)) {
                locations
                    .filter(loc => loc.parent_id === location.location_id)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .forEach(addLocation);
            }
        };

        hierarchicalData.forEach(addLocation);
        return result;
    }, [locations, hierarchicalData, expanded]);

    const table = useReactTable({
        data: getVisibleData,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search locations..."
                        value={globalFilter}
                        onChange={e => setGlobalFilter(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Button onClick={onAdd}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Location
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <TableHead key={header.id}>
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No locations found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    className={cn(
                                        "transition-colors hover:bg-muted/50",
                                        row.original._level && "bg-muted/30"
                                    )}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default LocationTable;