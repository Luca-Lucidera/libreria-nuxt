import type { MangaToShowImage } from "~/types/book/mangaToShow";

export default defineEventHandler(async (event) => {
  const body = await readBody<MangaToShowImage>(event);
  console.log(body.idCopertina);
  console.log(body.image);
  console.log(body.numeroCopertina);
  return "ciao";
});
