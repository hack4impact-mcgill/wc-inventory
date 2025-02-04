
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";

const ActivityLogTable: React.FC = () => { 

    return (
        <Table>
            <TableHeader>
                <TableRow> 
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Box</TableHead>
                    <TableHead>Time</TableHead>
                </TableRow>
                </TableHeader>
                {/* Table Body */}
                <TableBody>
                    <TableRow>
                    <TableCell>Jean G.</TableCell>
                    <TableCell> {"Moved box from Winter Inventory room to Level 1 > Aisle 2 > Slide B"} </TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>timestamp</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Laura R.</TableCell>
                    <TableCell> {"Donated Box"} </TableCell>
                    <TableCell>25</TableCell>
                    <TableCell>timestamp</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>Harry T.</TableCell>
                    <TableCell> {"Donated Box"} </TableCell>
                    <TableCell>51</TableCell>
                    <TableCell>timestamp</TableCell>
                    </TableRow>
                    <TableRow>
                    <TableCell>...</TableCell>
                    <TableCell> {"..."} </TableCell>
                    <TableCell>{"..."}</TableCell>
                    <TableCell>{"..."}</TableCell>
                    </TableRow>
                    </TableBody>
    </Table>
  );
};

export default ActivityLogTable;


