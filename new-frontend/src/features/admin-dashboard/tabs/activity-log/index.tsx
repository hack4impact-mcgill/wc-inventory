import { useEffect, useState } from "react";
import SearchBar from "./components/searchbar.tsx";
import ActivityLogTable from "./components/table.tsx";
import { useQuery } from "@tanstack/react-query";
import { activityLogApi } from "@/lib/api/activity-log.ts";
import { queryKeys } from "@/lib/api/queryKeys.ts";
import { BoxMovementView } from "@/types/activity-log.ts";

const ActivityLog = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState<BoxMovementView[]>();

    const { data: activityLogs, isLoading } = useQuery({
        queryFn: activityLogApi.getActivityLogs,
        queryKey: queryKeys.activityLog.all,
    });
    
    useEffect(() => {
        console.log('test');
        // Write filtering fn here
        activityLogs?.filter((activityLog) => {
            return activityLog.box_name?.startsWith(searchTerm)
        })
    }, [searchTerm])
    
    if (isLoading) {
        return (<>
            <span></span>
        </>)
    }

    // Use Effect for a filtration
    // Modify table to take list of activityLogs and nothing else
    // Modify table for structure of BoxMovementView

    console.log(activityLogs as BoxMovementView[] )


    return (
        <>
            <SearchBar searchTerm={searchTerm} onSearchChange={(val) => setSearchTerm(val)} />
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">Activity Log</h1>
                <ActivityLogTable />
            </div>
        </>
    );
};

export default ActivityLog;