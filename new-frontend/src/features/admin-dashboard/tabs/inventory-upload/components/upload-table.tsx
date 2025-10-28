import React, { useState } from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Size } from "@/types/size";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react";

interface ColumnDefinition {
  header: string;
  accessor: string;
}

interface UploadTableProps {
    data: object[];
    columns: ColumnDefinition[];
    categoryFilter?: string;
    nested: boolean;
    onEdit: (entry: Object) => void;
    onMerge: (entry: Object) => void;
    onDelete: (entry: Object) => void;
}

export function UploadTable({ data, columns, nested, onEdit, onDelete }: UploadTableProps) {

    // add expanded parent state
    const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

    const toggleExpansion = (locationId: string) => {

      if (expandedParents.has(locationId)) {
        const newSet = new Set(expandedParents);
        newSet.delete(locationId);
        setExpandedParents(newSet);
      } else {
        const newSet = new Set(expandedParents);
        newSet.add(locationId);
        setExpandedParents(newSet);
      }

    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {/* add extra space for the dropdown arrow if nested is enabled */}
                    {nested ? <TableHead className="w-[40px]"></TableHead> : null}
                    {columns.map((col) => (<TableHead key={col.accessor}>{col.header}</TableHead>) )}
                    <TableHead className="w-[70px]"></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {/* make sure the data should be shown (if there's a parent, it's expanded) */}
                {data.map((entry) => (!entry.parent_id || expandedParents.has(entry.parent_id)) ? (
                    <TableRow>
                        {/* add dropdown arrow for nested entries */}
                        {nested ? (
                            <TableCell>
                                {data.some(obj => obj.parent_id == entry.location_id) ? (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 hover:bg-transparent"
                                    onClick={() => {toggleExpansion(entry.location_id)}}
                                  >
                                    {expandedParents.has(entry.location_id) ? (
                                      <ChevronDown className="h-4 w-4" />
                                    ) : (
                                      <ChevronRight className="h-4 w-4" />
                                    )}
                                  </Button>
                               ) : null}
                            </TableCell>
                        ) : null}
                        {columns.map((col) => (
                          <TableCell>{entry[col.accessor]}</TableCell>
                        ))}
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                        onClick={() => onEdit(entry)}
                                    >
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onDelete(entry)}
                                        className="text-destructive"
                                    >
                                        Delete
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => onEdit(entry)}
                                    >
                                        Merge with...
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ) : null)}
            </TableBody>
        </Table>
    );
}