import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid request body",
    });
  }
  
  const userFound = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });
  if (!userFound) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  
  const isPasswordCorrect = await bcrypt.compare(
    body.password,
    userFound.password
  );
  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid credentials",
    });
  }
  
  const jwtSessionToken = createJwt(userFound.id);
  const updateUserLoginJwt = await prisma.user.update({
    where: {
      id: userFound.id,
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
