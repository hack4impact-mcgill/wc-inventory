import {Route, Tags, Controller, Get, Security} from "tsoa";
import {CategoryResponseDTO} from "../dtos/category.dto";
import {CategoryService} from "../services/category.service";

@Route("categories")
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
    @Security("jwt")
    public async getCategories(): Promise<CategoryResponseDTO[]> {
        this.setStatus(200);
        return this.categoryService.getCategories();
    }
    
}