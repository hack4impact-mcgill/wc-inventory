import { comparePassword, } from "../utils/password.util";
import { generateRefreshToken, generateToken } from "../utils/auth.util";
import { LoginRequestDTO } from "../dtos/auth.dto";
import { UserService } from "./user.service";
import { AuthenticationError } from "../utils/errors.util";
import { plainToInstance } from "class-transformer";
import { UserResponseDTO } from "../dtos/user.dto";
import jwt from 'jsonwebtoken';


export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(loginDto: LoginRequestDTO) {
    const user = await this.userService.getUserByUsername(loginDto.username);
    if (!user || !(await comparePassword(loginDto.password, user.password))) {
      throw new AuthenticationError("Invalid username or password");
    }
    const userResponse = plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
    const token = generateToken(user);
    const refreshToken = generateRefreshToken(user);
    return { token, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: number };
      const user = await this.userService.getUserById(decoded.userId);
      if (!user) {
        throw new AuthenticationError("User not found");
      }
      const newToken = generateToken(user);
      return { token: newToken };
    } catch (error) {
      throw new AuthenticationError("Invalid refresh token");
    }
  }

  async getProfile(userId: number): Promise<UserResponseDTO> {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new AuthenticationError("User not found");
    }
    return plainToInstance(UserResponseDTO, user, { excludeExtraneousValues: true });
  }

}
