import { useState } from "react";
import SearchBar from "./components/searchbar.tsx";
import ActivityLogTable from "./components/activity-log-table.tsx";
import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api/activity-log.ts";
import { queryKeys } from "@/lib/api/queryKeys.ts";
import { BoxMovementView } from "@/types/activity-log.ts";

const defaultStartDate = new Date("2000-01-01");
const defaultEndDate = new Date("2100-12-31");
type ActionTypes = "allActions" | "Donated" | "Moved" | "Retired";

const ActivityLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date>(defaultEndDate);
  const [action, setAction] = useState<ActionTypes>("allActions");

  // Get data entries
  const {
    data: activityLogs,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: activityLogApi.getActivityLogs,
    queryKey: queryKeys.activityLog.all,
  });

  if (isLoading) {
    return <span></span>;
  }

  // Filter for search box filters
  const filteredLogs = activityLogs?.filter((log) => {
    var isInDate = true;
    var isCorrectAction = true;
    var isCorrectName = log.box_name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (action != "allActions" && action != log.action) {
      isCorrectAction = false;
    }

    if (startDate > new Date(log.moved_at!)) {
      isInDate = false;
    }

    if (endDate < new Date(log.moved_at!)) {
      isInDate = false;
    }

    return isInDate && isCorrectAction && isCorrectName;
  });

  console.log(filteredLogs as BoxMovementView[]);
  return (
    <>
      <div className="p-16 gap-y-2 px-20 font-poppins">
        <div>
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setAction={setAction}
            onRefetch={refetch}
          />
        </div>
        <ActivityLogTable filteredData={filteredLogs!} isLoading={isLoading} />
      </div>
    </>
  );
};

export default ActivityLog;
