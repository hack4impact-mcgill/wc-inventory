import { LucideIcon } from "lucide-react";

type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'ONESIZE';
type Gender = 'M' | 'F' | 'U';

export type BoxContent = {
  box_content_id: string;
  box_id: string;
  category_id: string;
  size: Size;
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
