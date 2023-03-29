import IFilter from "~~/interface/filter";

export default defineEventHandler(async (event) => {
  let type = (await prisma.bookType.findMany()) as IFilter[];
  type.unshift({ id: "", name: "All" });
  return type;
});
