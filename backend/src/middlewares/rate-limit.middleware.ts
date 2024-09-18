import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: 'Too many login attempts, please try again later'
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests, please try again later'
});

export function applyRateLimiter(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/api/auth/login') {
        console.log("/api/auth/login -- test")
        return authLimiter(req, res, next);
    }
    if (req.path.startsWith('/api/')) {
        return generalLimiter(req, res, next);
    }
    next();
}