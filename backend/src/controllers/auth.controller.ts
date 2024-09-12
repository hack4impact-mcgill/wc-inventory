import { Body, Post, Route, Tags, Response, Example, Request, Get, Security } from "tsoa";
import { AuthService } from "../services/auth.service";
import { BaseController } from "./base.controller";
import { LoginResponseDTO, AuthResponseDTO, LoginRequestDTO, ProfileResponseDTO } from "../dtos/auth.dto";
import { transformAndValidate } from "class-transformer-validator";
import { Request as ExpressRequest } from 'express';
import { UserPayload } from "../middlewares/auth.middleware";

interface AuthenticatedRequest extends ExpressRequest {
  user: UserPayload;
}

@Route("api/auth")
@Tags("Authentication")
export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  @Post("/login")
  @Response<LoginResponseDTO>(200, "OK")
  @Response<AuthResponseDTO>(400, "Bad Request")
  @Response<AuthResponseDTO>(401, "Unauthorized")
  @Example<LoginResponseDTO>({
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  public async login(@Body() request: LoginRequestDTO): Promise<LoginResponseDTO> {
    const loginRequestDTO = await transformAndValidate<LoginRequestDTO>(LoginRequestDTO, request);
    return this.authService.login(loginRequestDTO);
  }

  @Get("/profile")
  @Security("jwt")
  @Response<ProfileResponseDTO>(200, "OK")
  @Response<AuthResponseDTO>(401, "Unauthorized")
  public async getProfile(@Request() request: AuthenticatedRequest): Promise<ProfileResponseDTO> {
    return this.authService.getProfile(request.user!.userId);
  }
}


