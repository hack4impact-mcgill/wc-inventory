import { Body, Post, Route, Tags, Response, Example, Request, Get, Security, Controller, SuccessResponse } from "tsoa";
import { AuthService } from "../services/auth.service";
import { LoginResponseDTO, AuthResponseDTO, LoginRequestDTO, ProfileResponseDTO } from "../dtos/auth.dto";
import { transformAndValidate } from "class-transformer-validator";
import { Request as ExpressRequest } from 'express';
import { UserPayload } from "../middlewares/auth.middleware";
import { ErrorResponse } from "../middlewares/error-handling.middleware";

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

  @Post("/login")
  @Response<LoginResponseDTO>(200, "OK")
  @Response<AuthResponseDTO>(400, "Bad Request")
  @Response<ErrorResponse>(401, "Unauthorized")
  @Example<LoginResponseDTO>({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  public async login(@Body() request: LoginRequestDTO): Promise<LoginResponseDTO> {
    this.setStatus(200);
    const loginRequestDTO = await transformAndValidate<LoginRequestDTO>(LoginRequestDTO, request);
    return this.authService.login(loginRequestDTO);
  }

  @Get("/profile")
  @Security("jwt")
  @SuccessResponse<ProfileResponseDTO>(200, "OK")
  @Response<ErrorResponse>(401, "Unauthorized")
  public async getProfile(@Request() request: AuthenticatedRequest): Promise<ProfileResponseDTO> {
    this.setStatus(200);
    return this.authService.getProfile(request.user!.userId);
  }

  // @Get('/refresh')
  // @Security("jwt")
  // @Response<LoginResponseDTO>(200, "OK")
  // public async getRefresh(@Request() request: AuthenticatedRequest): Promise<LoginResponseDTO> {
  //   return this.authService.refresh(request.user!.userId);
  // }

  // @Get('/logout')
  // @Security("jwt")
  // @Response<AuthResponseDTO>(200, "OK")
  // public async logout(@Request() request: AuthenticatedRequest): Promise<AuthResponseDTO> {
  //   return this.authService.logout(request.user!.userId);
  // }

}


