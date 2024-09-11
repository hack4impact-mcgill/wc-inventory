import { comparePassword, } from "../utils/password.util";
import { generateToken } from "../utils/auth.util";
import { LoginRequestDTO } from "../dtos/auth.dto";
import { UserService } from "./user.service";
import { AuthenticationError } from "../utils/errors.util";
import { plainToInstance } from "class-transformer";
import { UserResponseDTO } from "../dtos/user.dto";

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(loginDto: LoginRequestDTO) {
    const user = await this.userService.getUserByUsername(loginDto.username);

    if (!user || ! await comparePassword(loginDto.password, user.password)) {
      throw new AuthenticationError("Invalid username or password");
    }
    const userResponse = plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
    const token = generateToken(user);
    return { token, user: userResponse };
  }

  async getProfile(userId: string): Promise<UserResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
  }

}
