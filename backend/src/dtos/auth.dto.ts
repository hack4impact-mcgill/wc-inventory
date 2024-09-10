import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDTO {
    @IsNotEmpty()
    @IsString()
    username!: string;

    @IsNotEmpty()
    @IsString()
    password!: string;
}

export class AuthResponseDTO {
    message!: string;
    token?: string;
}

export class LoginResponseDTO {
    token!: string;
}