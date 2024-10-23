import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table';
import { fetchLocations, deleteLocation } from '@/lib/api';
import { Location } from '@/types/location';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const columnHelper = createColumnHelper<Location>();

const LocationManagement = () => {
    const [globalFilter, setGlobalFilter] = React.useState('');

    const { data: locations = [], isLoading } = useQuery({
        queryKey: ['locations'],
        queryFn: fetchLocations,
    });

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => info.getValue(),
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
            header: 'Parent',
            cell: info => {
                const parentId = info.getValue();
                if (!parentId) return '-';
                const parent = locations.find(loc => loc.location_id === parentId);
                return parent?.name || parentId;
            },
        }),
        columnHelper.display({
            id: 'actions',
            cell: props => (
                <div className="flex gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(props.row.original)}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(props.row.original.location_id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data: locations,
        columns,
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const handleEdit = (location: Location) => {
        console.log('Edit:', location);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Are you sure?')) {
            deleteLocation(id);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search locations..."
                            value={globalFilter}
                            onChange={e => setGlobalFilter(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <Button>
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
                                        className="text-center"
                                    >
                                        No locations found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                table.getRowModel().rows.map(row => (
                                    <TableRow key={row.id}>
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
            </CardContent>
        </Card>
    );
};

export default LocationManagement;