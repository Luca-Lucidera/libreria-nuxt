export default defineEventHandler(async (event) => {
  return await prisma.statusBook.findMany();
});