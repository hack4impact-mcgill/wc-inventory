import { Body, Get, Path, Post, Route, Tags, Security, Response, Controller, OperationId, SuccessResponse } from "tsoa";
import { UserService } from "../services/user.service";
import { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';
import { transformAndValidate } from "class-transformer-validator";
import { ErrorResponse } from "../middlewares/error-handling.middleware";
import { mapToDTO, mapToDTOArray } from "../utils/dto-mapper.util";


@Route("users")
@Tags("Users")
export class UserController extends Controller {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
  * Get users
  *
  * @summary Get Users
  */
  @Get()
  @OperationId("getUsers")
  @Security("jwt", ["Admin"])
  @SuccessResponse(200, "Ok")
  @Response<ErrorResponse>(401, "Unauthorized")
  public async getUsers(): Promise<UserResponseDTO[]> {
    this.setStatus(200);
    const users = await this.userService.getUsers()
    return mapToDTOArray(UserResponseDTO, users);
  }


  /**
 * Get user by Id
 *
 * @summary Get User
 * 
 * @param {uuid} id UUID of the user
 */
  @Get("{id}")
  @OperationId('getUserById')
  @Security("jwt", ["Admin"])
  @SuccessResponse(200, "Ok")
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(404, "User not found")
  public async getUserById(@Path() id: number): Promise<UserResponseDTO> {
    this.setStatus(200);
    const user = await this.userService.getUserById(id);
    return mapToDTO(UserResponseDTO, user);
  }

  /**
 * Create user
 *
 * @summary Create User
 * 
 * @param requestBody User to create
 */
  @Post()
  @Security("jwt", ["Admin"])
  @OperationId('createUser')
  @SuccessResponse(201, "Created User")
  @Response<ErrorResponse>(400, "Bad Request")
  @Response<ErrorResponse>(409, "Conflict - User already exists")
  public async createUser(@Body() requestBody: CreateUserDTO): Promise<UserResponseDTO> {
    this.setStatus(201);
    const userDto = await transformAndValidate(CreateUserDTO, requestBody, { validator: { whitelist: true, forbidNonWhitelisted: true } });
    const user = await this.userService.createUser(userDto);
    return mapToDTO(UserResponseDTO, user);
  }
}
