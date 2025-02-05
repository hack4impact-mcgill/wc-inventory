import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const InventoryDashboard = () => {
  // Mock data for the table
  const boxes = [
    {
      id: "1",
      name: "1",
      location: "Level 1>Aisle 2>Side B",
      createdAt: "2024-01-30T12:00:00",
      updatedAt: "2024-02-01T15:30:00",
    },
    {
      id: "2",
      name: "2",
      location: "Platform 802",
      createdAt: "2024-01-28T09:15:00",
      updatedAt: "2024-01-29T14:20:00",
    },
    {
      id: "3",
      name: "3",
      location: "Winter distribution room",
      createdAt: "2024-01-25T16:45:00",
      updatedAt: "2024-01-26T10:10:00",
    },
    {
      id: "25",
      name: "25",
      location: "Level 3>Aisle 2/Side B/Row 1",
      createdAt: "2024-01-20T11:30:00",
      updatedAt: "2024-01-22T09:45:00",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
      </div>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="flex-1 flex gap-4">
          <Input placeholder="Search by box name" className="max-w-xs" />
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="winter">Winter</SelectItem>
              <SelectItem value="summer">Summer</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">XS</SelectItem>
              <SelectItem value="s">S</SelectItem>
              <SelectItem value="m">M</SelectItem>
              <SelectItem value="l">L</SelectItem>
              <SelectItem value="xl">XL</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Move</Button>
          <Button variant="outline">Donate</Button>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Box name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Updated at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {boxes.map((box) => (
              <TableRow key={box.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell className="font-medium underline text-blue-600">
                  {box.name}
                </TableCell>
                <TableCell>{box.location}</TableCell>
                <TableCell>{formatDate(box.createdAt)}</TableCell>
                <TableCell>{formatDate(box.updatedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default InventoryDashboard;