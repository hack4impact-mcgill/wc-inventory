import { Controller, Get, Route, Path, Security, Response } from "tsoa";
import { CategoryService } from "../services/category.service";
import { CategoryDTO, CategoryResponseDTO } from "../dtos/category.dto";

@Route("category")
export class CategoryController extends Controller {
  private categoryService: CategoryService;

  constructor() {
    super();
    this.categoryService = new CategoryService();
  }

  @Get("{id}")
  @Security("jwt") 
  @Response("401", "Unauthorized")
  @Response("400", "Bad Request")
  @Response("404", "Category not found")
  async getCategoryById(@Path() id: number): Promise<CategoryResponseDTO> {
    this.setStatus(200);
    const category = await this.categoryService.getCategoryById(id);
    return category;
  }


}
