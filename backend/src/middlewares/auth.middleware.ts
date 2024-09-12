import { Request } from "express";
import jwt from "jsonwebtoken";
import { AuthenticationError } from "../utils/errors.util";

export interface UserPayload {
  userId: string;
  username: string;
  role: string;
}

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
): Promise<UserPayload> {
  if (securityName === "jwt") {
    const token = request.headers["authorization"];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new AuthenticationError("Invalid token"));
        return;
      }
      jwt.verify(
        token!,
        process.env.JWT_SECRET || "your-secret-key",
        (err: any, decoded: any) => {
          if (err) {
            if (err) {
              if (err.name === 'TokenExpiredError') {
                reject(new AuthenticationError("Token has expired"));
              } else if (err.name === 'JsonWebTokenError') {
                reject(new AuthenticationError("Invalid token"));
              } else {
                reject(new AuthenticationError("Token verification failed"));
              }
              return;
            }
          }
          else {

            if (!decoded || typeof decoded !== 'object') {
              reject(new AuthenticationError("Invalid token payload"));
              return;
            }

            // Role Check
            if (scopes && scopes.length > 0) {
              if (!decoded.role || scopes.indexOf(decoded.role) === -1) {
                reject(new AuthenticationError("Insufficient permissions"));
                return;
              }
            }
            const userPayload: UserPayload = {
              userId: decoded.userId,
              username: decoded.username,
              role: decoded.role
            };
            resolve(userPayload);
          }
        },
      );
    });
  }
  return Promise.reject(new AuthenticationError("Invalid security name"));
}
