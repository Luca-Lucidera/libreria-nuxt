import bcrypt from "bcrypt";
import ILogin from "~~/interface/auth/login";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as ILogin | null;
  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credential",
    });
  }
  const user = await prisma.users.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "Invalid credentials" });
  }
  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }
  const jwtSessionToken = createJwt(user.id);
  const updateUserLoginJwt = await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      jwt: jwtSessionToken,
    },
  });
  setCookie(event, "session", jwtSessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 86400000),
  });
  return updateUserLoginJwt;
});
