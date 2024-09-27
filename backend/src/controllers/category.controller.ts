import {Route, Tags, Controller, Get, Security, Response, OperationId} from "tsoa";
import {CategoryResponseDTO} from "../dtos/category.dto";
import {CategoryService} from "../services/category.service";
import {ErrorResponse} from "../middlewares/error-handling.middleware";

@Route("categories")
@Tags("Users")
export class CategoryController extends Controller {
    private categoryService: CategoryService;

    constructor() {
        super();
        this.categoryService = new CategoryService();
    }

    /**
     * Get categories
     *
     * @summary Get categories
     */
    @Get()
    @OperationId("getCategories")
    @Security("jwt")
    @Response(200, "Success")
    @Response<ErrorResponse>(400, "Bad Request")
    @Response<ErrorResponse>(401, "Unauthorized")
    public async getCategories(): Promise<CategoryResponseDTO[]> {
        this.setStatus(200);
        return this.categoryService.getCategories();
    }
    
}