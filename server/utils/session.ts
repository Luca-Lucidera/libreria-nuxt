import { H3Event, parseCookies } from "h3";

/**
 * 
 * @param {H3Event} event 
 * @returns Return the jwt string from the cookie
 */
export function getSessionJwtFromCookie(event: H3Event) {
  const headers = parseCookies(event);
  if (!headers["session"]) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return headers["session"];
}
