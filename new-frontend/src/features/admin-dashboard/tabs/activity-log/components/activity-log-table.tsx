import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import SearchBar from "./searchbar";
import { BoxMovementView } from "@/types/activity-log";
import { format } from "date-fns";

interface ActivityLogTableProps {
  filteredData: BoxMovementView[];
  isLoading: boolean;
}

const ActivityLogTable = ({
  filteredData,
  isLoading,
}: ActivityLogTableProps) => {
  if (isLoading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<
    "user" | "box" | "time" | "action" | null
  >(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  //sort Table:
  // const sortedData = [...filteredData].sort((a, b) => {
  //   if (!sortKey) return 0;
  //   const valueA = a[sortKey];
  //   const valueB = b[sortKey];

  //   if (typeof valueA === "string" && typeof valueB === "string") {
  //     return sortOrder === "asc"
  //       ? valueA.localeCompare(valueB)
  //       : valueB.localeCompare(valueA);
  //   } else {
  //     return sortOrder === "asc"
  //       ? (valueA as number) - (valueB as number)
  //       : (valueB as number) - (valueA as number);
  //   }
  // });

  const filteredRows = filteredData.filter((e) =>
    e.box_name !== null && e.box_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow>
            <TableHead
              className="font-bold cursor-pointer"
              onClick={() => {
                setSortKey("user");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              User <ArrowUpDown className="inline" />
            </TableHead>

            <TableHead
              className="font-bold cursor-pointer"
              onClick={() => {
                setSortKey("action");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Action <ArrowUpDown className="inline" />
            </TableHead>

            <TableHead
              className="font-bold cursor-pointer"
              onClick={() => {
                setSortKey("box");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Box <ArrowUpDown className="inline" />
            </TableHead>

            <TableHead
              className="font-bold cursor-pointer"
              onClick={() => {
                setSortKey("time");
                setSortOrder(sortOrder === "asc" ? "desc" : "asc");
              }}
            >
              Time <ArrowUpDown className="inline" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.length > 0 ? (
            filteredRows.map((entry, index) => (
              <TableRow key={index} className="border">
                 <TableCell className="text-blue-500 underline cursor-pointer">
                  {entry.moved_by_email}
                </TableCell>
                <TableCell>{entry.note}</TableCell>
                <TableCell className="text-blue-500 underline cursor-pointer">
                  {entry.box_name}
                </TableCell>
                <TableCell>{entry.moved_at? format(new Date(entry.moved_at), "MMM dd, yyyy, hh:mm a") : "N/A"}</TableCell> 
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
