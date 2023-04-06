import { User } from "@prisma/client";

export default defineEventHandler(async (event) => {
  const { id }: User = event.context.user;

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      jwt: "",
    },
  });

  setCookie(event, "session", "", {
    expires: new Date(0),
  });
  return true;
});
