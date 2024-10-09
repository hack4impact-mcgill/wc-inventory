
import {
    IsNotEmpty,
    isNumber,
    IsOptional,
    IsString,
    MaxLength,
    ValidateNested,
} from "class-validator";
import { Expose, Transform, Type } from "class-transformer";


export class CategoryResponseDTO {
    @Expose()
    id!: number;

    @Expose()
    @IsString()
    name!: string;

    @Expose()
    @Transform((({ obj }) => obj.parentCategory?.id ?? null))
    parentCategoryId?: number;

    // @Expose()
    // @IsOptional()
    // parentCategory?: CategoryResponseDTO;

    // @Expose()
    // @ValidateNested({ each: true })
    // @IsOptional()
    // subcategories?: CategoryResponseDTO[];
}

// export class CategoryDTO extends CategoryResponseDTO {
//     @Expose()
//     @IsString()
//     parentCategoryId?: string;
// }
