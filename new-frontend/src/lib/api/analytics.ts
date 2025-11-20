import { supabase } from "../supabaseClient";

export const analyticsAPI = {
    donatedBoxesCount: async (startDate: string, endDate: string) => {
        let q = supabase.from("boxes").select("box_id", { count: "exact" });
        if (startDate) q = q.gte("donated_at", startDate);
        if (endDate) q = q.lte("donated_at", endDate);
        const { count, error } = await q;
        if (error) throw new Error(error.message);
        return count;        
    },

    donatedItemsCount: async (startDate: string, endDate: string) => {
        let q = supabase.from("box_contents_view").select("quantity, donated_at");
        if (startDate) q = q.gte("donated_at", startDate);
        if (endDate) q = q.lte("donated_at", endDate);
        const { data, error } = await q;

        if (error) throw new Error(error.message);

        // sum all items in boxes
        const total = (data ?? []).reduce((sum: number, row: any) => sum + (row.quantity ?? 0), 0);
        return total;
    },

    stockTotals: async () => {
        const { data: boxes, error: boxesError } = await supabase
            .from("boxes")
            .select("box_id, location_id, status");
        
        if (boxesError) throw new Error(boxesError.message);

        // remove donated boxes
        const inStockBoxes = (boxes ?? []).filter((b: any) => b.location_id !== null && b.status !== "Donated");
        const totalBoxes = inStockBoxes.length;

        // get items
        const { data: contents, error: contentsError } = await supabase
            .from("box_contents_view")
            .select("quantity, location_id");
        if (contentsError) throw new Error(contentsError.message);

        // sum all items in boxes
        const totalItems = (contents ?? []).reduce((sum: number, row: any) => {
            return sum + ((row.location_id !== null) ? (row.quantity ?? 0) : 0);
        }, 0);

        return { totalBoxes, totalItems };
    },

    topItems: async (limit: number, startDate: string, endDate: String) => {
        let q = supabase.from("box_contents_view").select("category_id, quantity, donated_at");
        if (startDate) q = q.gte("donated_at", startDate);
        if (endDate) q = q.lte("donated_at", endDate);

        const { data, error } = await q;
        if (error) throw new Error(error.message);

        const totals: Record<string, number> = {};
        (data ?? []).forEach((row: any) => {
            const cat = row.category_id ?? "unknown";
            totals[cat] = (totals[cat] || 0) + (row.quantity ?? 0);
        });

        const items = Object.entries(totals)
            .map(([category_id, total]) => ({ category_id, total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, limit ?? 6);
        return items;

    },

    topUsers: async (limit: number, startDate: string, endDate: string) => {
        let q = supabase.from("box_movements").select("moved_by, moved_at").eq("action", "Donated");
        if (startDate) q = q.gte("moved_at", startDate);
        if (endDate) q = q.lte("moved_at", endDate);

        const { data, error } = await q;
        if (error) throw new Error(error.message);

        const counts: Record<string, number> = {}; // user, donations
        (data ?? []).forEach((row: any) => {
            const user = row.moved_by ?? "unknown";
            counts[user] = (counts[user] || 0) + 1;
        });

        const users = Object.entries(counts)
        .map(([user_id, donated_count]) => ({ user_id, donated_count }))
        .sort((a, b) => b.donated_count - a.donated_count)
        .slice(0, limit ?? 6);

        return users;
    }
}
