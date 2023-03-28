export default defineEventHandler(async (event) => {
  const tableHeaders = await prisma.tableHeaders.findMany();
  return tableHeaders;
});
