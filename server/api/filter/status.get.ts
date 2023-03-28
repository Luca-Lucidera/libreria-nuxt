import IFilter from "~~/interface/filter";

export default defineEventHandler(async (event) => {
  let status = await prisma.statusBook.findMany() as IFilter[];
  status.push({ id: "", name: "All" });
  return status;
});