import { UserDTO, UserResponseDTO } from '../dtos/user.dto';
import jwt from 'jsonwebtoken';

export function generateToken(user: UserDTO | UserResponseDTO): string {
    return jwt.sign(
        { userId: user.id, username: user.username, role: user.role, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
    );
}

export function generateRefreshToken(user: UserDTO | UserResponseDTO): string {
    return jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" },
    );
}