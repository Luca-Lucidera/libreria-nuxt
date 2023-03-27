import { H3Event, parseCookies } from "h3";

export function getSessionValue(event: H3Event) {
  const headers = parseCookies(event);
  if (!headers["session"]) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }
  return headers["session"];
}
