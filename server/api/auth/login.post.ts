import ILogin from "@/interface/login";
import { PrismaClient } from "@prisma/client";
import { v5 as uuid } from "uuid";
import User from "~~/interface/user";
export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as ILogin;
  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }
  const prisma = new PrismaClient();
  const user = (await prisma.users.findUnique({
    where: {
      email: body.email,
    },
  })) as User | null;
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }
  if (user.password !== body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid email or password",
    });
  }

  const { value, ...sessionCookiePayload } = {
    value: uuid(user.id, uuid.URL),
    expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
    httpOnly: true,
    secure: true,
    SameSite: "lax",
  };
  setCookie(event, "session", value, { ...sessionCookiePayload });
  await prisma.logins.upsert({
    where: {
      userId: user.id,
    },
    create: {
      userId: user.id,
      lastLogin: new Date(),
      expires: sessionCookiePayload.expires,
      sessionUUID: value,
    },
    update: {
      lastLogin: new Date(),
      expires: sessionCookiePayload.expires,
      sessionUUID: value,
    },
  });
  await prisma.$disconnect();
  return user;
});
