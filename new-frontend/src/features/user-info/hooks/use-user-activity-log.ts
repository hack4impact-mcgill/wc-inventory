import { activityLogApi } from "@/lib/api/activity-log"
import { queryKeys } from "@/lib/api/queryKeys"
import { useQuery } from "@tanstack/react-query"


export const useUserActivityLogs = (userId: string) => {
    return useQuery({
      queryKey: queryKeys.activityLog.byUser(userId),
      queryFn: () => activityLogApi.getActivityLogByUserId(userId)
    })
}