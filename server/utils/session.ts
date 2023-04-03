import { H3Event, parseCookies } from "h3";

/**
 * 
 * @param event {H3Event}
 * @returns Return the jwt with the user id
 */
export function getSessionJwtFromCookie(event: H3Event) {
  const headers = parseCookies(event);
  if (!headers["session"]) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return headers["session"];
}
