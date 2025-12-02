import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BoxMovementView } from "@/types/activity-log";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

type SortKeyOption = "moved_by_email" | "box_name" | "moved_at" | "default";

interface ActivityLogTableProps {
  filteredData: BoxMovementView[];
  isLoading: boolean;
  onBoxSelect: (boxId: string, anchorEl: HTMLElement) => void;
}

const ActivityLogTable = ({
  filteredData,
  isLoading,
  onBoxSelect,
}: ActivityLogTableProps) => {
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState<SortKeyOption>("default");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    const data = [...filteredData]; // copy, don’t mutate props

    data.sort((a, b) => {
      let result = 0;

      switch (sortKey) {
        case "moved_by_email": {
          const emailA = a.moved_by_email;
          const emailB = b.moved_by_email;

          if (!emailA && !emailB) result = 0;
          else if (!emailA)
            result = 1; // a null → after
          else if (!emailB)
            result = -1; // b null → after
          else result = emailA.localeCompare(emailB);
          break;
        }
        case "box_name":
          result = a.box_name!.localeCompare(b.box_name!);
          break;
        case "moved_at":
          result = a.moved_at!.localeCompare(b.moved_at!);
          break;
        default:
          result = 0;
      }

      return sortOrder === "asc" ? result : -result;
    });
    console.log(filteredData);
  }, [sortKey, sortOrder, defaultBox]);

  if (isLoading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  // apply box name filtering
  const filteredRows = filteredData.filter((row) =>
    (row.box_name ?? "").toLowerCase().includes(searchValue.toLowerCase()),
  );

  // ----------------------------- Table Header -----------------------------------------

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              User
              <ArrowUpDown
                className="inline pl-1 hover:cursor-pointer"
                onClick={() => {
                  setSortKey("moved_by_email");
                  console.log("sortKey", sortKey);
                  sortOrder === "asc"
                    ? setSortOrder("desc")
                    : setSortOrder("asc");
                  console.log("sortOrder", sortOrder);
                }}
              />
            </TableHead>

            <TableHead>Action</TableHead>

            <TableHead>Note</TableHead>

            <TableHead>
              Box
              <ArrowUpDown
                className="inline pl-1 hover:cursor-pointer"
                onClick={() => {
                  setSortKey("box_name");
                  console.log("sortKey", sortKey);
                  sortOrder === "asc"
                    ? setSortOrder("desc")
                    : setSortOrder("asc");
                  console.log("sortOrder", sortOrder);
                }}
              />
            </TableHead>

            <TableHead>
              Time
              <ArrowUpDown
                className="inline pl-1 hover:cursor-pointer"
                onClick={() => {
                  setSortKey("moved_at");
                  sortOrder === "asc"
                    ? setSortOrder("desc")
                    : setSortOrder("asc");
                }}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRows.length > 0 ? (
            filteredRows.map((entry, index) => (
              <TableRow key={index}>
                <TableCell
                  className={`text-[#00559B] ${
                    index === filteredRows.length - 1 ? "rounded-bl-md" : ""
                  }`}
                >
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
                <TableCell>{entry.note}</TableCell>
                <TableCell className="text-[#00559B] ">
                  <span
                    className=" hover:underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (entry.box_id) {
                        onBoxSelect(
                          String(entry.box_id),
                          e.currentTarget as HTMLElement,
                        );
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {entry.box_name}
                  </span>
                </TableCell>
                <TableCell
                  className={`${
                    index === filteredRows.length - 1 ? "rounded-br-md" : ""
                  }`}
                >
                  {entry.moved_at
                    ? format(new Date(entry.moved_at), "MMM dd, yyyy, hh:mm a")
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="font-normal">
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
