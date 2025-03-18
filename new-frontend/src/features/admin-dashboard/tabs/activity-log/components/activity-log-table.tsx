import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { BoxMovementView } from "@/types/activity-log";
import { format, set } from "date-fns";
import { useNavigate } from "react-router-dom";

type SortKeyOption = "moved_by_email" | "box_name" | "moved_at" | null;

interface ActivityLogTableProps {
  filteredData: BoxMovementView[];
  isLoading: boolean;
}

const ActivityLogTable = ({
  filteredData,
  isLoading,
}: ActivityLogTableProps) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKeyOption>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Sorting method for the toggle, sorts descending or asceding. 
  useEffect(() => {

    if (!sortKey) {
      setSortKey("box_name");
    }
    
    filteredData.sort((a, b) => {
      let result = 0;

      switch (sortKey) {
        case "moved_by_email":
          result = a.moved_by_email!.localeCompare(b.moved_by_email!);
          break;
        case "box_name":
          result = a.box_name!.localeCompare(b.box_name!);
          break;
        case "moved_at":
          result = a.moved_at!.localeCompare(b.moved_at!);
          break;
        default: 
          console.error("Invalid sort key");
          return 0;
      }
      return sortOrder === "asc" ? result : -result;
    });
    console.log(filteredData);
  }, [sortKey, sortOrder]);

  if (isLoading) {
    return <p className="text-center p-4">Loading...</p>;
  }

// ----------------------------- Table Header -----------------------------------------

  return (
    <div>
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold cursor-pointer">
              User <ArrowUpDown 
              className="inline"
              onClick={() => {
                setSortKey("moved_by_email");
                console.log("sortKey", sortKey);
                (sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc"));
                console.log("sortOrder", sortOrder);
              }}
              />
            </TableHead>

            <TableHead
              className="font-bold cursor-pointer"
            >
            Action 
            </TableHead>

            <TableHead className="font-bold cursor-pointer">
              Box 
              <ArrowUpDown 
                className="inline" 
                onClick={() => {
                  setSortKey("box_name");
                  console.log("sortKey", sortKey);
                  (sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc"));
                  console.log("sortOrder", sortOrder);              }}/>
            </TableHead>

            <TableHead className="font-bold cursor-pointer">
              Time 
              <ArrowUpDown className="inline" onClick={() => {
                  setSortKey("moved_at");
                  (sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc"));
              }}/>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody> 
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <TableRow key={index} className="border">
                <TableCell className="text-blue-500">
                  <span
                    onClick={() => {
                      navigate(`/admin/users/${entry.moved_by_user_id}`);
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    {entry.moved_by_email}
                  </span>
                </TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell className="text-blue-500 underline">
                <span
                  onClick={() => {
                    // TODO: Navigate to box popup
                    navigate(`/admin/inventory`);
                  }}
                  className="hover:underline cursor-pointer">
                  {entry.box_name}
                </span>
                </TableCell>
                <TableCell>
                  {entry.moved_at
                    ? format(new Date(entry.moved_at), "MMM dd, yyyy, hh:mm a")
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityLogTable;
