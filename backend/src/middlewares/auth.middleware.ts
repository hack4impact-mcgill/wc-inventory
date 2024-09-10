import { Request } from "express";
import jwt from "jsonwebtoken";

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
    const token = request.headers["authorization"]?.split(" ")[1];

    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new Error("No token provided"));
      }
      jwt.verify(
        token!,
        process.env.JWT_SECRET || "your-secret-key",
        (err: any, decoded: any) => {
          if (err) {
            reject(err);
          } else {
            // Checking role
            if (scopes && scopes.length > 0) {
              if (scopes.indexOf(decoded.role) === -1) {
                reject(new Error("Invalid role"));
              }
            }
            resolve(decoded);
          }
        },
      );
    });
  }
  return Promise.reject(new Error("Invalid security name"));
}
