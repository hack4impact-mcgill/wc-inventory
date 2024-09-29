
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";


export class CategoryResponseDTO {
    @Expose()
    @IsString()
    id!: string;

    @Expose()
    @IsString()
    name!: string;

    @Expose()
    @IsOptional()
    @IsString()
    parentCategoryId?: string;

    @Expose()
    @ValidateNested({ each: true })
    @IsOptional()
    subcategories?: CategoryResponseDTO[];
}

export class CategoryDTO extends CategoryResponseDTO {
    @Expose()
    @IsString()
    parentCategoryId?: string;
}
