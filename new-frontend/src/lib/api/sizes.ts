import {supabase} from "..//supabaseClient.ts"
import {SizeInsert, SizeUpdate} from "@/types/size.ts";

//Creating an API object to handle operations related to sizes
// (export means make it available outside this file, const means make sizeApi not re-assignable to a different object)
export const sizeApi = {

    getSizes: async () => { //asynchronus function (excecutes in one block / strict sequence)

        const {data, error} = await supabase
            .from("sizes")
            .select(' *, box_contents ( count ) )');

        if (error) throw new Error(error.message);

        // If data is successfully fetched, map over the results to include a "usageCount"
        if (data) {
            return data.map(size => ({
                ...size,
                usageCount: size.box_contents?.length || 0 // Add a usage count based on the box contents length, defaulting to 0 if no box contents are found
            }))
        }
        else {
            throw new Error(" 500, No data was fetched!! Size data is null!")
        }

    },

    createSize: async (newSize: SizeInsert) => {
        const {data, error} = await supabase
            .from("sizes")
            .insert(newSize)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    },

    checkSizeUsage: async (sizeId: string): Promise<number> => {
        const { count, error } = await supabase
          .from("box_contents")
          .select("*", { count: 'exact', head: true })
          .eq("size", sizeId);

        if (error) {
            throw new Error(error.message);
        }

        return count || 0;
    },

    updateSize: async (id: string, updatedSize: SizeUpdate) => {
        const { data, error } = await supabase
            .from("sizes")
            .update(updatedSize)
            .eq("size_id", id)
            .select("*")
            .single();

        if (error) throw error;
        return data;
    },

    // Deletes a size based on its ID
    deleteSize: async (id: string) => {
        // First, check if the size is in use by querying the "box_contents" table
        const { count, error: countError } = await supabase
            .from("box_contents")
            .select("*", { count: 'exact', head: true }) // Select from "box_contents" with the exact count of records
            .eq("size", id); // Filter by the size ID

        // If there's an error fetching the count, throw the error
        if (countError) throw countError;

        // If the size is still in use (i.e., count > 0), prevent deletion and throw an error
        if (count && count > 0) {
            throw new Error(`Cannot delete size as it is used by ${count} items.`);
        }

        // If the size is not in use, proceed with deletion
        const { error } = await supabase
            .from("sizes")
            .delete() // Delete the size
            .eq("size_id", id); // Filter by the size ID

        // If an error occurs during deletion, throw the error
        if (error) throw error;
    }

};
