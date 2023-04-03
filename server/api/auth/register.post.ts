import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
<<<<<<< HEAD
  const body = await readBody(event);
  if(!body || !body.name || !body.lastName || !body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Bad request" });
=======
  const body = (await readBody(event)) as IRegister | null;
  if (!body || !body.name || !body.lastName || !body.email || !body.password) {
    throw createError({ statusCode: 400, message: "Invalid credentials" });
>>>>>>> master
  }
  const { name, lastName, email, password } = body;

  const checkUserAlreadyExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
<<<<<<< HEAD
  if(checkUserAlreadyExist) {
=======

  if (checkUserAlreadyExist) {
>>>>>>> master
    throw createError({ statusCode: 400, message: "User already exist" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      lastName,
      email,
      password: encryptedPassword,
<<<<<<< HEAD
    }
  })

=======
    },
  });
>>>>>>> master
  const jwt = createJwt(user.id);

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      jwt,
<<<<<<< HEAD
    }
  })

=======
    },
  });
>>>>>>> master
  setCookie(event, "session", jwt, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 86400000),
  });
  
  return user;
});
