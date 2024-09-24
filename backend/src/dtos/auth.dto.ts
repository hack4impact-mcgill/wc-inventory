import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserResponseDTO } from './user.dto';

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

export class ProfileResponseDTO extends UserResponseDTO { }


export class RefreshTokenDTO {
    @IsNotEmpty()
    @IsString()
    refreshToken!: string;
}
