import { Size } from "@/types/sizes"
import { supabase } from "../supabaseClient"

export const sizesApiKeys = {
  all: ["sizes"] as const
}

export const sizesApi = {
  async getAll() {
    const { data } = await supabase.from("sizes").select()

    return data as Size[]
  }
}
