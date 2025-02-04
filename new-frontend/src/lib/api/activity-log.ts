import { BoxMovementInsert, BoxMovementView } from "@/types/activity-log"
import { supabase } from "../supabaseClient"

export type APIError = {
  message: string
  status: number
}

export const activityLogApi = {
  /**
   * Create a new activity log entry
   * @param actionData The box movement data to insert
   * @returns The created box movement record
   * @throws APIError if the operation fails
   */
  createActivityLog: async (actionData: BoxMovementInsert) => {
    try {
      const { data, error } = await supabase
        .from('box_movements')
        .insert(actionData)
        .select('*')
        .single()

      if (error) {
        throw {
          message: error.message,
          status: 400
        } as APIError
      }

      return data
    } catch (error) {
      if ((error as APIError).status) {
        throw error
      }
      throw {
        message: 'Failed to create activity log',
        status: 500
      } as APIError
    }
  },

  /**
   * Get activity logs for a specific user
   * @param userId The ID of the user
   * @returns Array of box movement records for the user
   * @throws APIError if the operation fails
   */
  getActivityLogByUserId: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('box_movements_view')
        .select('*')
        .eq('moved_by_user_id', userId)
        .order('moved_at', { ascending: false })

      if (error) {
        throw {
          message: error.message,
          status: 400
        } as APIError
      }

      return data as BoxMovementView[]
    } catch (error) {
      if ((error as APIError).status) {
        throw error
      }
      throw {
        message: 'Failed to fetch user activity logs',
        status: 500
      } as APIError
    }
  },

  /**
   * Get all activity logs
   * @returns Array of all box movement records
   * @throws APIError if the operation fails
   */
  getActivityLogs: async () => {
    try {
      const { data, error } = await supabase
        .from('box_movements_view')
        .select('*')
        .order('moved_at', { ascending: false })

      if (error) {
        throw {
          message: error.message,
          status: 400
        } as APIError
      }

      return data as BoxMovementView[]
    } catch (error) {
      if ((error as APIError).status) {
        throw error
      }
      throw {
        message: 'Failed to fetch activity logs',
        status: 500
      } as APIError
    }
  }
}
