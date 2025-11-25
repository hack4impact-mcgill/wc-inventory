import { useEffect, useMemo, useState } from "react";
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
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";

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

    return data;
  }, [filteredData, sortKey, sortOrder]);

  // // Sorting method for the toggle, sorts descending or asceding.
  // useEffect(() => {
  //   if (!sortKey) {
  //     setSortKey("box_name");
  //   }

  //   filteredData.sort((a, b) => {
  //     let result = 0;

  //     //
  //     switch (sortKey) {
  //       // case "moved_by_email":
  //       //   if (!a.moved_by_email) {
  //       //     result = -1;
  //       //     break;
  //       //   }
  //       //   if (!b.moved_by_email) {
  //       //     result = 1;
  //       //     break;
  //       //   }
  //       //   result = a.moved_by_email!.localeCompare(b.moved_by_email!);
  //       //   break;
  //       case "moved_by_email": {
  //         const emailA = a.moved_by_email;
  //         const emailB = b.moved_by_email;

  //         // Put null/undefined at the end
  //         if (!emailA && !emailB) {
  //           result = 0; // both null → equal
  //         } else if (!emailA) {
  //           result = 1; // a is null → a goes AFTER b
  //         } else if (!emailB) {
  //           result = -1; // b is null → a goes BEFORE b
  //         } else {
  //           // Both non-null → do normal string comparison
  //           result = emailA.localeCompare(emailB);
  //         }
  //         break;
  //       }
  //       case "box_name":
  //         result = a.box_name!.localeCompare(b.box_name!);
  //         break;
  //       case "moved_at":
  //         result = a.moved_at!.localeCompare(b.moved_at!);
  //         break;
  //       default:
  //         console.error("Invalid sort key");
  //         return 0;
  //     }
  //     return sortOrder === "asc" ? result : -result;
  //   });
  //   // console.log(filteredData);
  // }, [sortKey, sortOrder]);

  if (isLoading) {
    return <p className="text-center p-4">Loading...</p>;
  }

  // apply box name filtering
  const filteredRows = filteredData.filter(row =>
    (row.box_name ?? "").toLowerCase().includes(searchValue.toLowerCase())
);


  // ----------------------------- Table Header -----------------------------------------

  return (
    <div>
      <Table className="border-separate border-spacing-0 w-full">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300 rounded-tl">
              User{" "}
              <ArrowUpDown
                className="inline pl-1"
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

            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300">
              Action
            </TableHead>

            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300">
              Note
            </TableHead>

            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300">
              Box
              <ArrowUpDown
                className="inline pl-1"
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

            <TableHead className="font-poppins font-normal text-black p-4 cursor-pointer border-[0.5px] border-gray-300 rounded-tr-md">
              Time
              <ArrowUpDown
                className="inline pl-1"
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
          {sortedData.length > 0 ? (
            sortedData.map((entry, index) => (
              <TableRow key={index} className="border-[0.5px]">
                <TableCell
                  className={` border-[0.5px] border-gray-300 p-4 ${
                    index === sortedData.length - 1 ? "rounded-bl-md" : ""
                  }`}
                >
                  {entry.moved_by_email ? (
                    <span
                      onClick={() => {
                        navigate(`/admin/users/${entry.moved_by_user_id}`);
                      }}
                      className="hover:underline cursor-pointer text-[#00559B]"
                    >
                      {entry.moved_by_email}
                    </span>
                  ) : (
                    <span className="text-gray-800">[USER DELETED]</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-500 border-[0.5px] border-gray-300 p-4">
                  {entry.action}
                </TableCell>
                <TableCell className="text-gray-500 border-[0.5px] border-gray-300 p-4">
                  {entry.note}
                </TableCell>
                <TableCell className="text-[#00559B] border-[0.5px] border-gray-300 p-4">
                  <span
                    className="underline hover:no-underline cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (entry.box_id) {
                        onBoxSelect(String(entry.box_id), e.currentTarget as HTMLElement);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                  {entry.box_name}
                  </span>
                </TableCell>
                <TableCell
                  className={`text-gray-500 border-[0.5px] border-gray-300 p-4${
                    index === sortedData.length - 1 ? "rounded-br-md" : ""
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
              <TableCell
                colSpan={4}
                className="text-center py-4 border-[0.5px] border-gray-300 p-4 font-poppins font-normal "
              >
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