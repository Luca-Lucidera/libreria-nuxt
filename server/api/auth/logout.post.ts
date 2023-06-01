import { User } from "@prisma/client";

export default defineEventHandler(async (event) => {
  setCookie(event, "refresh_token", "", {
    expires: new Date(0),
  });
  return true;
});
