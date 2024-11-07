type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'ONESIZE';
type Gender = 'M' | 'F' | 'U';

export interface BoxContent {
  box_content_id: number;
  size: Size;
  category_id: number;
  gender: Gender;
  quantity: number;
}

export type Box = {
  box_id: number;
  name: string;
  description: string;
  location_id: number;
  created_at: Date;
  updated_at: Date;
  contents: BoxContent[];
  movement: string; // TODO
  tags: Array<number>; //TODO
};
