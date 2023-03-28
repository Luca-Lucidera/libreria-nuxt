import IFilter from "~~/interface/filter";

export default defineEventHandler(async (event) => {
  let type = (await prisma.bookType.findMany()) as IFilter[];
  type.push({ id: "", name: "All" });
  return type;
});
