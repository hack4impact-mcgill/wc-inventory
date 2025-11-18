import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { activityLogApi } from "@/lib/api/activity-log";
import { queryKeys } from "@/lib/api/queryKeys";
import { userApi } from "@/lib/api/users";
import { BoxMovementView } from "@/types/activity-log";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UserInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return <div>No user id provided</div>;

  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: queryKeys.users.detail(id!),
    queryFn: () => userApi.getUser(id!),
  });

  const { data: userActivity, isLoading: activityLoading } = useQuery({
    queryKey: queryKeys.activityLog.byUser(id!),
    queryFn: () => activityLogApi.getActivityLogByUserId(id!),
  });

  const setActiveMutation = useMutation({
    mutationFn: async (next: "active" | "inactive") => {
      // Hard guard: both user and user.id must be present and non-null
      if (!user || !user.id) throw new Error("User or user.id is missing");
      return userApi.setUserActive(user.id, next === "active");
    },
    onSuccess: async () => {
      // Re-fetch the user row so the UI stays in sync
      await qc.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("User ID missing");
      return userApi.deleteUser(userId);
    },
    onSuccess: async () => {
      // Invalidate any queries that depend on this user
      // ensure authoritative data
      await qc.invalidateQueries({ queryKey: ["users"] });

      // clean up per-user caches
      qc.removeQueries({ queryKey: queryKeys.users.detail(userId!) });
      await qc.invalidateQueries({
        queryKey: queryKeys.activityLog.byUser(userId!),
      });

      toast.success("User deleted");
      // navigate away after delete
      navigate("/admin/users");
    },
    onError: async () => {
      toast.error("Error deleting user");
    },
  });

  const onChangeAccountStatus = (value: string) => {
    const v = value === "active" ? "active" : "inactive";
    setActiveMutation.mutate(v);
  };

  if (userLoading || activityLoading || !user) return <div>Loading...</div>;

  const userId = user.id ?? null;
  if (!userId) return <div>Invalid user record (missing id)</div>;

  const statusValue: "active" | "inactive" = user.is_active
    ? "active"
    : "inactive";

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
              <p>{user.name ?? "N/A"}</p>
            </div>
            <div className="mb-4">
              <label className="font-semibold">Email: </label>
              <p>{user.email ?? "N/A"}</p>
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
                value={statusValue}
                onValueChange={onChangeAccountStatus}
                disabled={setActiveMutation.isPending}
              >
                <SelectTrigger className="mt-1 w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
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
            {
              <>
                <Button
                  variant="destructive"
                  disabled={deleteUserMutation.isPending}
                  onClick={() => deleteUserMutation.mutate()}
                >
                  {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
                <br />
                <Button
                  variant="destructive"
                  onClick={() => userApi.deleteUser(userId)}
                >
                  New Delete
                </Button>
              </>
            }
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
                  <TableCell colSpan={4}>No activity found</TableCell>
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
