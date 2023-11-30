<script setup lang="ts">
import type { MangadexCover } from "~/types/book/Mangadex/cover";

// definePageMeta({
//   middleware: [
//     () => {
//       if (process.env.NODE_ENV === "production") {
//         return "/";
//       }
//     },
//   ],
// });

const cop = ref<any>("");
async function fetchListaManga() {
  try {
    const params = {
      title: "secchan",
      limit: 10,
    };
    const response = await $fetch(mangadexMangaProxyApi, { params });
    console.log("RESPONSE FETCH MANGA LIST:", response);
  } catch (error) {
    console.log(error);
  }
}

async function fetchCopertina() {
  try {
    const secchanId = "d79f3680-8bae-4950-b7c2-30c339156229";
    const urlParams = {
      mangaArray: `manga[]=${secchanId}`,
      limit: "limit=50",
      offset: "offset=" + 0,
      order: "order[volume]=asc",
    };
    const responseCopertina = await $fetch<MangadexCover>(
      mangadexCoverProxyApi + "?" + Object.values(urlParams).join("&")
    );
    console.log("RESPONSE COPERTINA:", responseCopertina);

    const response2 = await $fetch(
      `${mangadexBaseUrlImageApi}/${secchanId}/${responseCopertina.data[0].attributes.fileName}.256.jpg`
    );
    console.log("IMMAGINE PRESA:", response2);
    cop.value = response2;
  } catch (error) {
    console.log("Errore in fetchCopertina", error);
  }
}
</script>

<template>
  <VBtn @click="fetchListaManga">fetch lista manga</VBtn>
  <VBtn @click="fetchCopertina">fetch copertina</VBtn>
  <VImg :src="cop" />
</template>
