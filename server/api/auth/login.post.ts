import bcrypt from "bcrypt";
<<<<<<< HEAD

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
=======
import ILogin from "~~/interface/auth/login";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as ILogin | null;
>>>>>>> master
  if (!body || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credential",
    });
  }
<<<<<<< HEAD
  
  const userFound = await prisma.user.findUnique({
=======
  const user = await prisma.users.findUnique({
>>>>>>> master
    where: {
      email: body.email,
    },
  });
<<<<<<< HEAD
  if (!userFound) {
    throw createError({ statusCode: 404, statusMessage: "User not found" });
  }
  
  const isPasswordCorrect = await bcrypt.compare(
    body.password,
    userFound.password
  );
=======
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: "Invalid credentials" });
  }
  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
>>>>>>> master
  if (!isPasswordCorrect) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid credentials",
    });
  }
<<<<<<< HEAD
  
  const jwtSessionToken = createJwt(userFound.id);
  const updateUserLoginJwt = await prisma.user.update({
=======
  const jwtSessionToken = createJwt(user.id);
  const updateUserLoginJwt = await prisma.users.update({
>>>>>>> master
    where: {
      id: user.id,
    },
    data: {
      jwt: jwtSessionToken,
    },
  });
<<<<<<< HEAD

=======
>>>>>>> master
  setCookie(event, "session", jwtSessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 86400000),
  });
  return updateUserLoginJwt;
});
