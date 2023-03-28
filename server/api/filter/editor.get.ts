export default defineEventHandler(async (event) => {
  return await prisma.editor.findMany()
});