import { Box, BoxInsert, BoxUpdate } from '@/types/box';
import { Category, CategoryInsert, CategoryUpdate } from '@/types/category';
import { supabase } from './supabaseClient';
import { BoxMovement, BoxMovementInsert, BoxMovementUpdate } from '@/types/box-movement';
import { BoxContent, BoxContentInsert, BoxContentUpdate } from '@/types/box-contents';
import { UserInsert, UserUpdate } from '@/types/users';
import { Location, LocationInsert, LocationUpdate } from '@/types/location';
import { User } from '@supabase/supabase-js';

/**
 * Fetch all boxes.
 */
export const fetchBoxes = async (): Promise<Box[]> => {
  const { data, error } = await supabase
    .from('boxes')
    .select('*')
    .order('box_number', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Box[];
};

/**
 * Fetch a single box by ID.
 */
export const fetchBoxById = async (boxId: number): Promise<Box | null> => {
  const { data, error } = await supabase
    .from('boxes')
    .select('*')
    .eq('box_id', boxId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Box;
};

/**
 * Create a new box.
 */
export const createBox = async (box: BoxInsert): Promise<Box> => {
  const { data, error } = await supabase
    .from('boxes')
    .insert(box)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Box;
};

/**
 * Update an existing box.
 */
export const updateBox = async (boxId: number, updates: BoxUpdate): Promise<Box> => {
  const { data, error } = await supabase
    .from('boxes')
    .update(updates)
    .eq('box_id', boxId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Box;
};

/**
 * Delete a box.
 */
export const deleteBox = async (boxId: number): Promise<void> => {
  const { error } = await supabase
    .from('boxes')
    .delete()
    .eq('box_id', boxId);

  if (error) {
    throw new Error(error.message);
  }
};

// -----------------------------------
// 4.2. Categories
// -----------------------------------

/**
 * Fetch all categories.
 */
export const fetchCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Category[];
};

/**
 * Fetch a single category by ID.
 */
export const fetchCategoryById = async (categoryId: number): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('category_id', categoryId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Create a new category.
 */
export const createCategory = async (category: CategoryInsert): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
};

/**
 * Update an existing category.
 */
export const updateCategory = async (categoryId: number, updates: CategoryUpdate): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('category_id', categoryId)
    .select('*')
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
    .from('categories')
    .delete()
    .eq('category_id', categoryId);

  if (error) {
    throw new Error(error.message);
  }
};

/**
 * Fetch all locations.
 */
export const fetchLocations = async (): Promise<Location[]> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as Location[];
};

/**
 * Fetch a single location by ID.
 */
export const fetchLocationById = async (locationId: number): Promise<Location | null> => {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('location_id', locationId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Create a new location.
 */
export const createLocation = async (location: LocationInsert): Promise<Location> => {
  const { data, error } = await supabase
    .from('locations')
    .insert(location)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Location;
};

/**
 * Update an existing location.
 */
export const updateLocation = async (locationId: number, updates: LocationUpdate): Promise<Location> => {
  const { data, error } = await supabase
    .from('locations')
    .update(updates)
    .eq('location_id', locationId)
    .select('*')
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
    .from('locations')
    .delete()
    .eq('location_id', locationId);

  if (error) {
    throw new Error(error.message);
  }
};

// -----------------------------------
// 4.4. Users
// -----------------------------------

/**
 * Fetch all users.
 */
export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('first_name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as User[];
};

/**
 * Fetch a single user by ID.
 */
export const fetchUserById = async (userId: string): Promise<User | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') { // No rows found
      return null;
    }
    throw new Error(error.message);
  }

  return data as User;
};

/**
 * Create a new user.
 * 
 * **Important**: User creation is typically handled via Supabase Auth. Ensure that you manage authentication appropriately.
 */
export const createUser = async (user: UserInsert): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as User;
};

/**
 * Update an existing user.
 */
export const updateUser = async (userId: string, updates: UserUpdate): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as User;
};

/**
 * Delete a user.
 */
export const deleteUser = async (userId: string): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (error) {
    throw new Error(error.message);
  }
};

// -----------------------------------
// 4.5. Box Contents
// -----------------------------------

/**
 * Fetch all box contents.
 */
export const fetchBoxContents = async (): Promise<BoxContent[]> => {
  const { data, error } = await supabase
    .from('box_contents')
    .select('*')
    .order('box_content_id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxContent[];
};

/**
 * Fetch box contents by box ID.
 */
export const fetchBoxContentsByBoxId = async (boxId: number): Promise<BoxContent[]> => {
  const { data, error } = await supabase
    .from('box_contents')
    .select('*')
    .eq('box_id', boxId)
    .order('category_id', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxContent[];
};

/**
 * Create a new box content.
 */
export const createBoxContent = async (boxContent: BoxContentInsert): Promise<BoxContent> => {
  const { data, error } = await supabase
    .from('box_contents')
    .insert(boxContent)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxContent;
};

/**
 * Update an existing box content.
 */
export const updateBoxContent = async (boxContentId: number, updates: BoxContentUpdate): Promise<BoxContent> => {
  const { data, error } = await supabase
    .from('box_contents')
    .update(updates)
    .eq('box_content_id', boxContentId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxContent;
};

/**
 * Delete a box content.
 */
export const deleteBoxContent = async (boxContentId: number): Promise<void> => {
  const { error } = await supabase
    .from('box_contents')
    .delete()
    .eq('box_content_id', boxContentId);

  if (error) {
    throw new Error(error.message);
  }
};

// -----------------------------------
// 4.6. Box Movements
// -----------------------------------

/**
 * Fetch all box movements.
 */
export const fetchBoxMovements = async (): Promise<BoxMovement[]> => {
  const { data, error } = await supabase
    .from('box_movements')
    .select('*')
    .order('moved_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxMovement[];
};

/**
 * Fetch box movements by box ID.
 */
export const fetchBoxMovementsByBoxId = async (boxId: number): Promise<BoxMovement[]> => {
  const { data, error } = await supabase
    .from('box_movements')
    .select('*')
    .eq('box_id', boxId)
    .order('moved_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxMovement[];
};

/**
 * Create a new box movement.
 */
export const createBoxMovement = async (boxMovement: BoxMovementInsert): Promise<BoxMovement> => {
  const { data, error } = await supabase
    .from('box_movements')
    .insert(boxMovement)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxMovement;
};

/**
 * Update an existing box movement.
 */
export const updateBoxMovement = async (boxMovementId: number, updates: BoxMovementUpdate): Promise<BoxMovement> => {
  const { data, error } = await supabase
    .from('box_movements')
    .update(updates)
    .eq('box_movement_id', boxMovementId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as BoxMovement;
};

/**
 * Delete a box movement.
 */
export const deleteBoxMovement = async (boxMovementId: number): Promise<void> => {
  const { error } = await supabase
    .from('box_movements')
    .delete()
    .eq('box_movement_id', boxMovementId);

  if (error) {
    throw new Error(error.message);
  }
};