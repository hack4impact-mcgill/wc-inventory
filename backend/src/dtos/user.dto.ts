import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserRole } from "../entities/user.entity";
import { Expose } from "class-transformer";

export class CreateUserDTO {
  @IsNotEmpty({ message: "Username is required" })
  @IsString({ message: "Username must be a string" })
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(50, { message: "Username cannot exceed 50 characters" })
  @Matches(/^[a-zA-Z0-9_-]+$/, { message: "Username can only contain letters, numbers, underscores, and hyphens" })
  username!: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @MaxLength(50, { message: "Password cannot exceed 50 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password!: string;

  @IsOptional()
  @IsEmail({}, { message: "Invalid email format" })
  @MaxLength(255, { message: "Email cannot exceed 255 characters" })
  email?: string;

  @IsNotEmpty({ message: "Role is required" })
  @IsEnum(UserRole, { message: "Invalid user role" })
  role!: UserRole;
}

export class UserResponseDTO {
  @Expose()
  id!: number;

  @Expose()
  @IsString()
  username!: string;

  @Expose()
  @IsEmail()
  @IsOptional()
  email?: string;

  @Expose()
  @IsEnum(UserRole)
  role!: UserRole;
}

export class UserDTO extends UserResponseDTO {
  @Expose()
  @IsString()
  password!: string;
}
