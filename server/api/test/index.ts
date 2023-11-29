export default defineEventHandler(async (event) => {
  const resp = await $fetch('https://api.mangadex.org', {
    headers: {
      'Access-Control-Allow-Origin': 'https://libreria-git-ui-improvement-lucalucidera.vercel.app',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  });
  console.log(resp);
  return resp;
});