import { User } from '../entities/user.entity';
import jwt from 'jsonwebtoken';

export function generateToken(user: User): string {
    return jwt.sign(
        { userId: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" },
    );
}