import bcrypt from "bcrypt";
import type { UserRegisterDTO } from "~/types/user/userRegisterDTO";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as UserRegisterDTO;
  if (!body || !body.name || !body.lastName || !body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: "Bad request" });
  }
  const { name, lastName, email, password } = body;

  const checkUserAlreadyExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (checkUserAlreadyExist) {
    throw createError({ statusCode: 400, statusMessage: "User already exist" });
  }

  const encryptedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      lastName,
      email,
      password: encryptedPassword,
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  setCookie(event, "refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
  return { user: user, accessToken: accessToken };
});
