import bcrypt from "bcrypt";
import IRegister from "~~/interface/auth/register";

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as IRegister;
  if(!body || !body.name || !body.lastName || !body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Bad request" });
  }
  const { name, lastName, email, password } = body;

  const checkUserAlreadyExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if(checkUserAlreadyExist) {
    throw createError({ statusCode: 400, message: "User already exist" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      lastName,
      email,
      password: encryptedPassword,
    }
  })

  const jwt = createJwt(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      jwt,
    }
  })

  setCookie(event, "session", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 86400000),
  });
  
  return user;
});
