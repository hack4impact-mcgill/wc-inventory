import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";


export class LocationResponseDTO {
    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsString()
    name!: string;

    @Expose()
    @IsOptional()
    @IsString()
    parentLocationId?: string;

    @Expose()
    @ValidateNested({ each: true })
    @IsOptional()
    sublocations?: LocationResponseDTO[];
}

export class LocationDTO extends LocationResponseDTO {
    @Expose()
    @IsString()
    parentLocationId?: string;
}
