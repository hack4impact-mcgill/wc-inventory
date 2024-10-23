import React, { useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getExpandedRowModel,
    flexRender,
    createColumnHelper,
    ColumnDef,
    ExpandedState,
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
    const [expanded, setExpanded] = React.useState<ExpandedState>({});

    // Transform flat data into hierarchical structure
    const processedData = useMemo(() => {
        const locationMap = new Map<number | null, Location[]>();

        // Group by parent_id
        locations.forEach(location => {
            const parentId = location.parent_id;
            if (!locationMap.has(parentId)) {
                locationMap.set(parentId, []);
            }
            locationMap.get(parentId)?.push(location);
        });

        // Function to recursively build tree
        const buildTree = (parentId: number | null): Location[] => {
            const children = locationMap.get(parentId) || [];
            return children.map(item => ({
                ...item,
                subRows: buildTree(item.location_id)
            }));
        };

        return buildTree(null);
    }, [locations]);

    const columns = useMemo<ColumnDef<Location>[]>(() => [
        columnHelper.display({
            id: 'name',
            header: 'Name',
            cell: ({ row }) => (
                <div
                    style={{
                        paddingLeft: `${row.depth * 2}rem`,
                    }}
                    className="flex items-center gap-2"
                >
                    {row.getCanExpand() ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-transparent"
                            onClick={row.getToggleExpandedHandler()}
                        >
                            {row.getIsExpanded() ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    ) : (
                        <div className="w-6" />
                    )}
                    <span>{row.original.name}</span>
                </div>
            ),
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
                    {/* <Button
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
                    </Button> */}
                </div>
            ),
        }),
    ], [locations, onEdit, onDelete]);

    const table = useReactTable({
        data: processedData,
        columns,
        state: {
            expanded,
            globalFilter,
        },
        onExpandedChange: setExpanded,
        onGlobalFilterChange: setGlobalFilter,
        getSubRows: row => row.subRows,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search locations..."
                        value={globalFilter ?? ''}
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
                                        row.depth > 0 && "bg-muted/30"
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