import IFilter from '~~/interface/filter';
export default defineEventHandler(async (event) => {
  let editor = await prisma.editor.findMany() as IFilter[]
  editor.push({ id: "", name: "All" });
  return editor;
});