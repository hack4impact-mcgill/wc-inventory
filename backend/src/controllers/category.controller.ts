import { Controller, Get, Route, Path, Security, Response, OperationId, Tags } from "tsoa";
import { CategoryService } from "../services/category.service";
import { CategoryDTO, CategoryResponseDTO } from "../dtos/category.dto";
import { ErrorResponse } from "../middlewares/error-handling.middleware";

@Route("categories")
@Tags("Categories")
export class CategoryController extends Controller {
  private categoryService: CategoryService;

  constructor() {
    super();
    this.categoryService = new CategoryService();
  }

  /**
   * Get all categories
   * 
   * @summary Get categories
   */
  @Get()
  @OperationId("getCategories")
  @Security("jwt")
  @SuccessResponse(200, "Ok")
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  public async getCategories(): Promise<CategoryResponseDTO[]> {
    this.setStatus(200);
    return this.categoryService.getCategories();
  }

  /**
   * Get a category by ID
   * 
   * @param id Category ID
   */
  @Get("{id}")
  @OperationId("getCategoryById")
  @Security("jwt")
  @SuccessResponse(200, "Ok")
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  @Response<ErrorResponse>(404, "Category not found")
  public async getCategoryById(@Path() id: number): Promise<CategoryResponseDTO> {
    this.setStatus(200);
    const category = await this.categoryService.getCategoryById(id);
    return category;
  }
}
