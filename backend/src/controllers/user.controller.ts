import { Body, Get, Path, Post, Route, Tags, Security, Response } from "tsoa";
import { UserService } from "../services/user.service";
import { BaseController } from './base.controller';
import { CreateUserDTO, UserResponseDTO } from '../dtos/user.dto';
import { NotFoundError } from "../utils/errors.util";
import { transformAndValidate } from "class-transformer-validator";


@Route("api/users")
@Tags("Users")
export class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  @Get()
  @Security("jwt", ["Admin"])
  @Response<UserResponseDTO[]>(200, "Success")
  @Response(401, "Unauthorized")
  public async getUsers(): Promise<UserResponseDTO[]> {
    return this.userService.getUsers();
  }

  @Get("{id}")
  @Security("jwt", ["Admin"])
  @Response<UserResponseDTO>(200, "Success")
  @Response(404, "User not found")
  public async getUserById(@Path() id: string): Promise<UserResponseDTO> {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  @Post()
  @Security("jwt", ["Admin"])
  @Response<UserResponseDTO>(201, "Created")
  @Response(400, "Bad Request")
  public async createUser(@Body() requestBody: CreateUserDTO): Promise<UserResponseDTO> {
    const userDto = await transformAndValidate(CreateUserDTO, requestBody, { validator: { whitelist: true, forbidNonWhitelisted: true } });
    return this.userService.createUser(userDto);
  }
}