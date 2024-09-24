import { Body, Post, Route, Tags, Response, Example, Request, Get, Security, Controller } from "tsoa";
import { AuthService } from "../services/auth.service";
import { LoginResponseDTO, AuthResponseDTO, LoginRequestDTO, ProfileResponseDTO } from "../dtos/auth.dto";
import { transformAndValidate } from "class-transformer-validator";
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { UserPayload } from "../middlewares/auth.middleware";
import { ErrorResponse } from "../middlewares/error-handling.middleware";
import { UserRole } from "../entities/user.entity";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}

@Route("auth")
@Tags("Authentication")
export class AuthController extends Controller {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  /**
 * Login to the application using username and password
 *
 * @summary Login
 */
  @Post("/login")
  @Response<LoginResponseDTO>(200, "OK")
  @Response<AuthResponseDTO>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  @Example<LoginResponseDTO>({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  public async login(
    @Body() request: LoginRequestDTO
  ): Promise<LoginResponseDTO> {
    this.setStatus(200);
    const loginRequestDTO = await transformAndValidate<LoginRequestDTO>(LoginRequestDTO, request);
    const { token, refreshToken } = await this.authService.login(loginRequestDTO);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    };
    this.setHeader('Set-Cookie', `refreshToken=${refreshToken}; ${Object.entries(cookieOptions).map(([key, value]) => `${key}=${value}`).join('; ')}`);
    return { token };
  }

  @Get("/profile")
  @Security("jwt")
  @Response<ProfileResponseDTO>(200, "OK")
  @Response<ErrorResponse>(401, "Unauthorized")
  public async getProfile(@Request() request: AuthenticatedRequest): Promise<ProfileResponseDTO> {
    this.setStatus(200);
    return this.authService.getProfile(request.user!.userId);
  }

  @Post("/refresh")
  @Response<AuthResponseDTO>(200, "OK")
  @Response<ErrorResponse>(401, "Unauthorized")
  public async refreshToken(@Request() request: ExpressRequest): Promise<AuthResponseDTO> {
    const refreshToken = request.cookies?.refreshToken;
    if (!refreshToken) {
      this.setStatus(401);
      return { message: "Refresh token not found" };
    }

    try {
      const { token } = await this.authService.refreshToken(refreshToken);
      this.setStatus(200);
      return { message: "Token refreshed successfully", token };
    } catch (error) {
      this.setStatus(401);
      return { message: "Invalid refresh token" };
    }
  }

  @Post('/logout')
  @Security("jwt")
  @Response<AuthResponseDTO>(200, "OK")
  public async logout(): Promise<AuthResponseDTO> {
    this.setHeader('Set-Cookie', 'refreshToken=; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
    return { message: "Logged out successfully" };
  }

}


