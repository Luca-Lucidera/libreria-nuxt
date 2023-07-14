import {Result} from "~/types/result";
import { User } from "@prisma/client";
import jwt, { JsonWebTokenError } from "jsonwebtoken";

type JwtErrorResponse = {
  name: "ExpiredToken" | "InvalidToken";
  message: string;
};

export function generateAccessToken(user: User) {
  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
      lastName: user.lastName,
    },
    useRuntimeConfig().jwtSecret,
    {
      issuer: useRuntimeConfig().jwtIss,
      audience: useRuntimeConfig().jwtAud,
      expiresIn: "5m",
      algorithm: "HS256",
    }
  );
}

export function generateRefreshToken(user: User) {
  return jwt.sign(
    {
      userId: user.id,
      name: user.name,
      lastName: user.lastName,
    },
    useRuntimeConfig().jwtSecret,
    {
      issuer: useRuntimeConfig().jwtIss,
      audience: useRuntimeConfig().jwtAud,
      expiresIn: "7d",
      algorithm: "HS256",
    }
  );
}

//valida un jwt e ritorna lo userId
export function verifyJwtAndDecode(
  token: string
): Result<string, JwtErrorResponse> {
  try {
    const payload = jwt.verify(token, useRuntimeConfig().jwtSecret, {
      algorithms: ["HS256"],
      issuer: useRuntimeConfig().jwtIss,
      audience: useRuntimeConfig().jwtAud,
      ignoreExpiration: false,
    });

    if (typeof payload === "string") {
      return {
        success: false,
        errorData: {
          name: "InvalidToken",
          message: "payload token must be an object",
        },
      };
    }

    return {
      success: true,
      successData: payload.userId,
    };
  } catch (err: any) {
    const error: JsonWebTokenError = err;

    if (error.name === "TokenExpiredError") {
      return {
        success: false,
        errorData: {
          name: "ExpiredToken",
          message: "The token is expired",
        },
      };
    }

    console.error("JWT ERROR verifyJwtAndDecode()", { error }, "jwt", token);
    
    return {
      success: false,
      errorData: {
        name: "InvalidToken",
        message: "The token is invalid",
      },
    };
  }
}

export function decodeJwt(token: string) {
  const data = jwt.decode(token);
  if (!data) return null;
  if (typeof data === "string") return null;
  return data;
}
