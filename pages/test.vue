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

const cop = ref<string>("");
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
    const coverId = "9e7f621a-17f4-4027-9ec9-10964478f47a.jpg";
    const response2 = await $fetch<Blob>(
      `/api/proxy/image/${secchanId}/${coverId}.256.jpg`,
      { responseType: "blob" }
    );
    cop.value = URL.createObjectURL(response2);
  } catch (error) {
    console.log("Errore in fetchCopertina", error);
  }
}

const fetchStream = async () => {
  const response = await $fetch<ReadableStream>("/api/mangadex/covers", {
    responseType: "stream",
  });
  let chunks = [];
  const reader = response.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    chunks.push(value);
  }
  cop.value = URL.createObjectURL(new Blob(chunks));
};

const fetchBlob = async () => {
  const resp = await $fetch<Blob>("/api/mangadex/covers2", {
    responseType: "blob",
  });

  cop.value = URL.createObjectURL(resp);
}
</script>

<template>
  <VBtn @click="fetchListaManga">fetch lista manga</VBtn>
  <VBtn @click="fetchStream">fetch copertina</VBtn>
  <VBtn @click="fetchBlob">fetch copertina blob</VBtn>
  <VImg :src="cop" />
</template>
