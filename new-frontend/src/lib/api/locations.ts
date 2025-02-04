import { Location, LocationInsert, LocationUpdate } from "@/types/location";
import { supabase } from "../supabaseClient";

export const locationApi = {
    getLocations: async () => {
        const { data, error } = await supabase
            .from("locations")
            .select()
        if (error) throw new Error(error.message);

        return data as Location[];
    },

    createLocation: async (newLocation: LocationInsert) => {
        const { data, error } = await supabase
        .from('locations')
        .insert(newLocation)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    updateLocation: async ({ id, data }: { id: string; data: LocationUpdate }) => {
        const { data: updatedLocation, error } = await supabase
        .from('locations')
        .update(data)
        .eq('location_id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedLocation;
    },

    deleteLocation: async (id: string) => {
        const { error } = await supabase
        .from('locations')
        .delete()
        .eq('location_id', id);

      if (error) throw error;
    },

}