import { Expose, Transform, Type } from "class-transformer";
import { Location } from "../entities/location.entity";

export class ParentLocationDTO {
  @Expose()
  @Transform(({ obj }) => obj.location_id)
  parentLocationIdadsf!: string;

  @Expose()
  name!: string;

  @Expose()
  level!: number;
}

export class LocationResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj.location_id)
  locationId!: string;

  @Expose()
  name!: string;

  @Expose()
  description?: string;

  @Expose()
  level!: number;

  @Expose()
  @Type(() => ParentLocationDTO)
  parentLocation?: ParentLocationDTO;
}