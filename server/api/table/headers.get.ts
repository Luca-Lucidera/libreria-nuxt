import { Prisma } from "@prisma/client"
export default defineEventHandler(async (event) => {
  try {
    return await prisma.tableHeaders.findMany();
  } catch (e) {

    if(e instanceof Prisma.PrismaClientKnownRequestError) {
      throw handleKnownPrismaError(e);
    }

    if(e instanceof Prisma.PrismaClientRustPanicError) {
      return handleRustPanicError();
    }

    if(e instanceof Prisma.PrismaClientUnknownRequestError) {
      return handleUnknownPrismaError();
    }

    throw createError({ statusCode: 500, statusMessage: "Internal server error, sorry for the inconvenience" });
  }
});
