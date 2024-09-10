import { Request, Response, NextFunction } from 'express';
import { ValidateError } from 'tsoa';
import { Logger } from '../utils/logger.util';
import { AuthenticationError, AuthorizationError, DuplicateError, NotFoundError } from '../utils/errors.util';
import { TokenExpiredError } from 'jsonwebtoken';
import { ValidationError } from 'class-validator';

export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const logger = new Logger();

    if (err instanceof ValidateError) { //TSOA
        logger.warn(`Validation Error for ${req.path}:`, err.fields);
        return res.status(422).json({
            message: "Validation Failed",
            details: err?.fields,
        });
    }

    if (Array.isArray(err) && err.every(e => e instanceof ValidationError)) { // Class Validator
        const details = err.reduce((acc, curr) => {
            Object.keys(curr.constraints || {}).forEach(key => {
                acc.push(curr.constraints![key]);
            });
            return acc;
        }, [] as string[]);

        logger.warn(`Validation Error for ${req.path}:`, details);
        return res.status(400).json({
            message: "Validation Failed",
            details: details,
        });
    }

    if (err instanceof AuthenticationError) {
        logger.warn(`Authentication Error: ${err.message}`);
        return res.status(401).json({
            message: err.message,
        });
    }

    if (err instanceof AuthorizationError || err instanceof TokenExpiredError) {
        logger.warn(`Authorization Error: ${err.message}`);
        return res.status(403).json({
            message: err.message,
        });
    }

    if (err instanceof NotFoundError) {
        logger.warn(`Not Found Error: ${err.message}`);
        return res.status(404).json({
            message: err.message,
        });
    }

    if (err instanceof DuplicateError) {
        logger.warn(`Duplicate Error: ${err.message}`);
        return res.status(409).json({
            message: err.message
        });
    }

    if (err instanceof Error) {
        logger.error(`Internal Server Error: ${err.message}`);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }

    logger.error(`Unknown Error: ${JSON.stringify(err)}`);
    return res.status(500).json({
        message: "An unknown error occurred",
    });
}