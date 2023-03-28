export default defineEventHandler(async (event) => {
  return await prisma.bookType.findMany();
})