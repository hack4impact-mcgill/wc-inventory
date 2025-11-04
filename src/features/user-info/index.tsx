import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api/activity-log";
import { queryKeys } from "@/lib/api/queryKeys";
import { userApi } from "@/lib/api/users";
import { format } from "date-fns";
import { BoxMovementView } from "@/types/activity-log";

const UserInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>No user id provided</div>;

  const [accountStatus, setAccountStatus] = useState("active");

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userApi.getUser(id!),
  });

  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: queryKeys.activityLog.byUser(id!),
    queryFn: () => activityLogApi.getActivityLogByUserId(id!),
  });

  if (userLoading || activityLoading || !user) return <div>Loading...</div>;

  return (
    <Card className="max-w mx-auto">
      <CardHeader>
        <CardTitle>Manage Permissions & Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <label className="font-semibold">Name: </label>
              <p>{user.email}</p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Created on:</label>
              <p>
                {user.created_at
                  ? format(new Date(user.created_at), "PP")
                  : "-"}
              </p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Account Status:</label>
              <Select
                onValueChange={(value) => setAccountStatus(value)}
                defaultValue={accountStatus}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">
                    Active (current volunteer)
                  </SelectItem>
                  <SelectItem value="inactive">
                    Inactive (no longer volunteer)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-4">
              Role:{" "}
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "Unknown"}
            </h2>
            <div className="space-y-2">
              {/* {Object.keys(permissions).map((key) => (
                <label key={key} className="flex items-center space-x-2">
                  <Checkbox
                    checked={permissions[key as keyof typeof permissions]}
                    onCheckedChange={() =>
                      togglePermission(key as keyof typeof permissions)
                    }
                  />
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                  </span>
                </label>
              ))} */}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-4">Activity:</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Box</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userActivity && userActivity.length > 0 ? (
                userActivity.map((movement: BoxMovementView) => (
                  <TableRow key={movement.box_movement_id}>
                    <TableCell>
                      {movement.from_location_name} {"->"}{" "}
                      {movement.to_location_name}
                    </TableCell>
                    <TableCell>{movement.box_name}</TableCell>
                    <TableCell>
                      {format(new Date(movement.moved_at!), "PP")}
                    </TableCell>
                    <TableCell>{movement.note}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>No activity found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserInfo;
