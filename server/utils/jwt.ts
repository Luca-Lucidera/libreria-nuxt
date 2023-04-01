import jwt from "jsonwebtoken";

/**
 * 
 * @param userId  - The user id
 * @returns string jwt token
 */
export function createJwt(userId: string) {
  const jwtSessionToken = jwt.sign({userId: userId}, useRuntimeConfig().jwt.secret, {
    issuer: useRuntimeConfig().jwt.iss,
    audience: useRuntimeConfig().jwt.aud,
    expiresIn: "24h",
    algorithm: "HS256",
  });
  return jwtSessionToken;
}

/**
 * 
 * @param token - The jwt token
 * @returns string - The user uuid
 */
export function verifyJwt(token: string): string {
  const decoded = jwt.verify(token, useRuntimeConfig().jwt.secret, {
    issuer: useRuntimeConfig().jwt.iss,
    audience: useRuntimeConfig().jwt.aud,
    algorithms: ["HS256"],
  });
  if(!decoded) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  if(typeof decoded === "string") {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return decoded.userId;
}