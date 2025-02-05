
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";


//sample Data; 
const activityLogData = [
  { user: "Jean G.", action: "Moved box from Winter Inventory room to Level 1 > Aisle 2 > Side B", box: 1, time: "timestamp" },
  { user: "Laura R.", action: "Donated Box", box: 25, time: "timestamp" },
  { user: "Harry T.", action: "Deleted Box", box: 51, time: "timestamp" }
];


const ActivityLogTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<"user" | "box" | "time" | "action" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc"
    | "desc">("asc");



  //filter table based on search 
  const filteredData = activityLogData.filter((entry) =>
    entry.box.toString().includes(searchTerm)
  );

  //sort Table: 
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortKey) return 0;
    const valueA = a[sortKey];
    const valueB = b[sortKey];

    if (typeof valueA === "string" && typeof valueB === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc"
        ? (valueA as number) - (valueB as number)
        : (valueB as number) - (valueA as number);
    }
  });

  return (
    <div className="p-4">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="font-bold cursor-pointer" onClick={() => {
              setSortKey("user");
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}>
              User <ArrowUpDown className="inline" />
            </TableHead>

            <TableHead className="font-bold cursor-pointer" onClick={() => {
              setSortKey("action");
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}>
              Action <ArrowUpDown className="inline" />
            </TableHead>

            <TableHead className="font-bold">Action</TableHead>

            <TableHead className="font-bold cursor-pointer" onClick={() => {
              setSortKey("box");
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}>
              Box <ArrowUpDown className="inline" />
            </TableHead>

            <TableHead className="font-bold cursor-pointer" onClick={() => {
              setSortKey("time");
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            }}>
              Time <ArrowUpDown className="inline" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.length > 0 ? (
            sortedData.map((entry, index) => (
              <TableRow key={index} className="border">
                <TableCell className="text-blue-500 underline cursor-pointer">{entry.user}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell className="text-blue-500 underline cursor-pointer">{entry.box}</TableCell>
                <TableCell>{entry.time}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">No results found.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityLogTable;




// const ActivityLogTable: React.FC = () => { 

//     return (
//         <Table>
//             <TableHeader>
//                 <TableRow> 
//                     <TableHead>User</TableHead>
//                     <TableHead>Action</TableHead>
//                     <TableHead>Box</TableHead>
//                     <TableHead>Time</TableHead>
//                 </TableRow>
//                 </TableHeader>
//                 {/* Table Body */}
//                 <TableBody>
//                     <TableRow>
//                     <TableCell>Jean G.</TableCell>
//                     <TableCell> {"Moved box from Winter Inventory room to Level 1 > Aisle 2 > Slide B"} </TableCell>
//                     <TableCell>1</TableCell>
//                     <TableCell>timestamp</TableCell>
//                     </TableRow>
//                     <TableRow>
//                     <TableCell>Laura R.</TableCell>
//                     <TableCell> {"Donated Box"} </TableCell>
//                     <TableCell>25</TableCell>
//                     <TableCell>timestamp</TableCell>
//                     </TableRow>
//                     <TableRow>
//                     <TableCell>Harry T.</TableCell>
//                     <TableCell> {"Donated Box"} </TableCell>
//                     <TableCell>51</TableCell>
//                     <TableCell>timestamp</TableCell>
//                     </TableRow>
//                     <TableRow>
//                     <TableCell>...</TableCell>
//                     <TableCell> {"..."} </TableCell>
//                     <TableCell>{"..."}</TableCell>
//                     <TableCell>{"..."}</TableCell>
//                     </TableRow>
//                     </TableBody>
//     </Table>
//   );
// };

// export default ActivityLogTable;





