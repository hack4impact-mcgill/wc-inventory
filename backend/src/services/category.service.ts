import { Category } from "../entities/category.entity";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { CategoryResponseDTO } from "../dtos/category.dto";
import { plainToInstance } from "class-transformer";


export class CategoryService {
    private categoryRepository: Repository<Category>;

    constructor() {
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    private mapToCategoryResponseDTO(category: Category): CategoryResponseDTO {
        return plainToInstance(CategoryResponseDTO, category, { excludeExtraneousValues: true });
    }

    async getCategories(): Promise<CategoryResponseDTO[]> {
        const categories = await this.categoryRepository.find({
            relations: ['parentCategory']
        });
        return categories.map(this.mapToCategoryResponseDTO);
    }
}