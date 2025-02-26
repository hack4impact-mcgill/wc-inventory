import { useState, useEffect } from "react";
import SearchBar from "./components/searchbar.tsx";
import ActivityLogTable from "./components/activity-log-table.tsx";
import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api/activity-log.ts";
import { queryKeys } from "@/lib/api/queryKeys.ts";
import { BoxMovementView } from "@/types/activity-log.ts";


const defaultStartDate = new Date("2000-01-01");
const defaultEndDate = new Date("2100-12-31");
type ActionTypes = "allActions" | "Donated" | "Moved" | "Retired" | "Other";


const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);
  const [action, setAction] = useState<ActionTypes>("allActions");

  const { data: activityLogs, isLoading } = useQuery({
    queryFn: activityLogApi.getActivityLogs,
    queryKey: queryKeys.activityLog.all,
  });

  if (isLoading) {
    return <span></span>;
  }

  const filteredLogs = activityLogs?.filter((log) => {
    var isInDate = true
    var isCorrectActgion = true
    var isCorrecTName = log.box_name?.toLowerCase().includes(searchTerm.toLowerCase());

    //if action != default
    if (action != log.box_movement_id)
      //filter all logs for action == action
    // check if the filtered data date is within timeframe
    
    return isInDate && isCorrectActgion && isCorrecTName
  });

  console.log(activityLogs[0].action)
  // Use Effect for a filtration
  // Modify table to take list of activityLogs and nothing else
  // Modify table for structure of BoxMovementView

  console.log(filteredLogs as BoxMovementView[]);
  return (
    <>
      <div className="p-6 gap-y-2">
        <h1 className="text-xl font-bold mb-4">Activity Log</h1>
        <div className="flex flex-row">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} 
          startDate={startDate} setStartDate={setStartDate}
          endDate={endDate} setEndDate={setEndDate}
          action={action} setAction={setAction}/>
        </div>
        <ActivityLogTable filteredData={filteredLogs!} isLoading={isLoading} />
      </div>
    </>
  );
};

export default ActivityLog;
