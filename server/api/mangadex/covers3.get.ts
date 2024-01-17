export default defineEventHandler(async (event) => {
  const { mangaId, coverId } = getQuery(event);
  if (!mangaId || !coverId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid parameters",
    });
  }
  return await $fetch(
    `https://uploads.mangadex.org/covers/${mangaId}/${coverId}.256.jpg`,
    { responseType: "blob" }
  );
});
