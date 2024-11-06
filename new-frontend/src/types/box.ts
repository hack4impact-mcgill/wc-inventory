export type Box = {
  box_id: number;
  name: string;
  description: string;
  location_id: number;
  created_at: Date;
  updated_at: Date;
  contents: string; // TODO
  movement: string; // TODO
  tags: Array<number>; //TODO
};
