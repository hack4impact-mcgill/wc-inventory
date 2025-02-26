import { useState } from "react";
import SearchBar from "./components/searchbar.tsx";
import ActivityLogTable from "./components/activity-log-table.tsx";
import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api/activity-log.ts";
import { queryKeys } from "@/lib/api/queryKeys.ts";
import { BoxMovementView } from "@/types/activity-log.ts";

const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: activityLogs, isLoading } = useQuery({
    queryFn: activityLogApi.getActivityLogs,
    queryKey: queryKeys.activityLog.all,
  });

  if (isLoading) {
    return <span></span>;
  }

  const filteredLogs = activityLogs?.filter((log) =>
    log.box_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Use Effect for a filtration
  // Modify table to take list of activityLogs and nothing else
  // Modify table for structure of BoxMovementView

  console.log(filteredLogs as BoxMovementView[]);
  return (
    <>
      <div className="p-6 gap-y-2">
        <h1 className="text-xl font-bold mb-4">Activity Log</h1>
        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <ActivityLogTable filteredData={filteredLogs!} isLoading={isLoading} />
      </div>
    </>
  );

};

export default ActivityLog;
