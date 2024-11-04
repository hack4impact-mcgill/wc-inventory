import { Category, CategoryInsert, CategoryUpdate } from "@/types/category";
import { supabase } from "./supabaseClient";
import { Location, LocationInsert, LocationUpdate } from "@/types/location";
import { User } from "@supabase/supabase-js";

/**
 * Fetch all categories.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Category[];
};

/**
 * Fetch a single category by ID.
 */
export const fetchCategoryById = async (
  categoryId: number,
): Promise<Category | null> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("category_id", categoryId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Create a new category.
 */
export const createCategory = async (
  category: CategoryInsert,
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Update an existing category.
 */
export const updateCategory = async (
  categoryId: number,
  updates: CategoryUpdate,
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("category_id", categoryId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Delete a category.
 */
export const deleteCategory = async (categoryId: number): Promise<void> => {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("category_id", categoryId);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Fetch all locations.
 */
export const fetchLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Location[];
};

/**
 * Fetch a single location by ID.
 */
export const fetchLocationById = async (
  locationId: number,
): Promise<Location | null> => {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .eq("location_id", locationId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Create a new location.
 */
export const createLocation = async (
  location: LocationInsert,
): Promise<Location> => {
  const { data, error } = await supabase
    .from("locations")
    .insert(location)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Update an existing location.
 */
export const updateLocation = async (
  locationId: number,
  updates: LocationUpdate,
): Promise<Location> => {
  const { data, error } = await supabase
    .from("locations")
    .update(updates)
    .eq("location_id", locationId)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Delete a location.
 */
export const deleteLocation = async (locationId: number): Promise<void> => {
  const { error } = await supabase
    .from("locations")
    .delete()
    .eq("location_id", locationId);

  if (error) {
    throw new Error(error.message);
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("first_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as User[];
};
