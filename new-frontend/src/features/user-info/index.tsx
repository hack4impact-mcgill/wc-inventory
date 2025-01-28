import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";

const UserInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [permissions, setPermissions] = useState({
    createBox: false,
    moveBox: false,
    deleteBox: false,
    modifyBoxContent: false,
  });

  const [accountStatus, setAccountStatus] = useState("active");

  const togglePermission = (permission: keyof typeof permissions) => {
    setPermissions((prev) => ({
      ...prev,
      [permission]: !prev[permission],
    }));
  };

  return (
    <Card className="max-w mx-auto">
      <CardHeader>
        <CardTitle>Manage Permissions & Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {/* User Details */}
          <div>
            <div className="mb-4">
              <label className="font-semibold">Name: {id}</label>
              <p>User 1</p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Created on:</label>
              <p>2025-01-21</p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Account Status:</label>
              <Select onValueChange={(value) => setAccountStatus(value)} defaultValue={accountStatus}>
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active (current volunteer)</SelectItem>
                  <SelectItem value="inactive">Inactive (no longer volunteer)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <h2 className="font-semibold mb-4">Permissions:</h2>
            <div className="space-y-2">
              {Object.keys(permissions).map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <Checkbox
                    checked={permissions[key as keyof typeof permissions]}
                    onCheckedChange={() => togglePermission(key as keyof typeof permissions)}
                  />
                  <span className="capitalize">{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="mt-6">
          <h2 className="font-semibold mb-4">Activity:</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Box</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Example Action</TableCell>
                <TableCell>Box 1</TableCell>
                <TableCell>2025-01-21 10:00</TableCell>
              </TableRow>
              {/* Add more rows dynamically */}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
