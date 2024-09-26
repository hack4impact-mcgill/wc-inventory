import { Category } from "../entities/category.entity"; // i think there has to be like a categoryModel.ts file or something
import { CategoryDTO, CategoryResponseDTO } from "../dtos/category.dto";
import { Repository } from "typeorm";
import { AppDataSource } from "../database/database";
import { NotFoundError } from "../utils/errors.util";
import { plainToInstance } from "class-transformer";

export class CategoryService {
  private categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = AppDataSource.getRepository(Category);
  }

  private mapToCategoryResponseDTO(category: Category): CategoryResponseDTO {
    return plainToInstance(CategoryResponseDTO, category, { excludeExtraneousValues: true });
  }

  async getCategoryById(id: number): Promise<CategoryResponseDTO> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundError("Category not found");
    }
    
    return this.mapToCategoryResponseDTO(category);
  }
}
