import { LocationUpdate } from './../lib/api';
import { Tables } from "./supabase";

type LocationTable = Tables['locations'];

export type Location = LocationTable['Row'];

export type LocationUpdate = LocationTable['Update'];

export type LocationInsert = LocationTable['Insert'];