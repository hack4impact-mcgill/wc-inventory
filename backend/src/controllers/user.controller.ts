import { Body, Get, Path, Post, Route, Tags, Security, Response, Controller, OperationId, SuccessResponse } from "tsoa";
import { UserService } from "../services/user.service";
import { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';
import { NotFoundError } from "../utils/errors.util";
import { transformAndValidate } from "class-transformer-validator";
import { ErrorResponse } from "../middlewares/error-handling.middleware";


@Route("users")
@Tags("Users")
export class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  @Get()
  @OperationId("getUsers")
  @Security("jwt", ["Admin"])
  @SuccessResponse(200, "Success")
  @Response<ErrorResponse>(401, "Unauthorized")
  public async getUsers(): Promise<UserResponseDTO[]> {
    this.setStatus(200);
    return this.userService.getUsers();
  }

  @Get("{id}")
  @OperationId('getUserById')
  @Security("jwt", ["Admin"])
  @SuccessResponse(200, "Success")
  @Response(404, "User not found")
  public async getUserById(@Path() id: string): Promise<UserResponseDTO> {
    this.setStatus(200);
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  @Post()
  @Security("jwt", ["Admin"])
  @SuccessResponse(201, "Created")
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(409, "Conflict - User already exists")
  public async createUser(@Body() requestBody: CreateUserDTO): Promise<UserResponseDTO> {
    this.setStatus(201);
    const userDto = await transformAndValidate(CreateUserDTO, requestBody, { validator: { whitelist: true, forbidNonWhitelisted: true } });
    return this.userService.createUser(userDto);
  }
}