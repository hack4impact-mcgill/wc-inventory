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
      <Table className="border-separate border-spacing-0 w-full">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300 rounded-tl">
              User <ArrowUpDown 
              className="inline pl-1"
              onClick={() => {
                setSortKey("moved_by_email");
                console.log("sortKey", sortKey);
                (sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc"));
                console.log("sortOrder", sortOrder);
              }}
              />
            </TableHead>

            <TableHead
              className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300"
            >
            Action 
            </TableHead>

            <TableHead
              className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300"
            >
            Note 
            </TableHead>


            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300">
              Box 
              <ArrowUpDown 
                className="inline pl-1" 
                onClick={() => {
                  setSortKey("box_name");
                  console.log("sortKey", sortKey);
                  (sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc"));
                  console.log("sortOrder", sortOrder);              }}/>
            </TableHead>

            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300 rounded-tr-md">
              Time 
              <ArrowUpDown className="inline pl-1" onClick={() => {
                  setSortKey("moved_at");
                  (sortOrder === "asc" ? setSortOrder("desc") : setSortOrder("asc"));
              }}/>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody> 
          {filteredData.length > 0 ? (
            filteredData.map((entry, index) => (
              <TableRow key={index} className="border-[0.5px]">
                <TableCell className={`text-[#00559B] border-[0.5px] border-gray-300 p-4 hover:underline cursor-pointer ${
                      index === filteredData.length - 1 ? "rounded-bl-md" : ""
                    }`}>
                  <span
                    onClick={() => {
                      navigate(`/admin/users/${entry.moved_by_user_id}`);
                    }}
                    className="hover:underline cursor-pointer underline"
                  >
                    {entry.moved_by_email}
                  </span>
                </TableCell>
                <TableCell className="text-gray-500 border-[0.5px] border-gray-300 p-4">{entry.action}</TableCell>
                <TableCell className="text-gray-500 border-[0.5px] border-gray-300 p-4">{entry.note}</TableCell>
                <TableCell className="text-[#00559B] underline border-[0.5px] border-gray-300 p-4">
                <span
                  onClick={() => {
                    // TODO: Navigate to box popup
                    navigate(`/admin/box-lookup/`);
                  }}
                  className="hover:underline cursor-pointer">
                  {entry.box_name}
                </span>
                </TableCell>
                <TableCell className={`text-gray-500 border-[0.5px] border-gray-300 p-4${
                      index === filteredData.length - 1 ? "rounded-br-md" : ""
                    }`}>
                  {entry.moved_at
                    ? format(new Date(entry.moved_at), "MMM dd, yyyy, hh:mm a")
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 border-[0.5px] border-gray-300 p-4 font-poppins font-normal ">
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
