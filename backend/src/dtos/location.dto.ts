import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from "class-validator";
import { Expose, Transform, Type } from "class-transformer";

export class ParentLocationDTO {
    @Expose()
    @Transform(({ obj }) => obj.location_id)
    parentLocationId!: number; // Changed to int

    @Expose()
    name!: string;

    @Expose()
    level!: number;
}
export class LocationResponseDTO {
    @Expose()
    @Transform(({ obj }) => obj.location_id)
    locationId!: number; // Changed to int

    @Expose()
    name!: string;

    @Expose()
    description?: string;

    @Expose()
    level!: number;

    @Expose()
    @Type(() => ParentLocationDTO as any) // Fixed type issue
    parentLocation?: ParentLocationDTO;
}