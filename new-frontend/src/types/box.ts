import { LucideIcon } from "lucide-react";

type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'ONESIZE';
type Gender = 'M' | 'F' | 'U';

export interface BoxContent {
  box_content_id: string;
  size: Size;
  category_id: string;
  gender: Gender;
  quantity: number;
  icon: LucideIcon; // svg
}

export type Box = {
  box_id: string;
  name: string;
  description: string;
  location_id: string;
  created_at: Date;
  updated_at: Date;
  content: BoxContent[];
  movement: string; // TODO
  tags: Array<number>; //TODO
};
