<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { MangadexManga } from "~/types/book/Mangadex";

definePageMeta({
  middleware: [
    () => {
      if (process.env.NODE_ENV === "production") {
        return "/";
      }
    },
  ],
});

const globalStore = useGlobalStore();

type TitoloENumero = {
  titolo: string;
  numero: number;
};

const titoloENumero = useState<TitoloENumero>(() => ({
  titolo: "Kaiju No 8",
  numero: 1,
}));

const dialogCopertinaNomeENumero = useState(() => false);

const currentStep = useState(() => 1);

const nextStep = async () => {
  if (currentStep.value === 3) {
    //procedura per chiudere il modal e salvare i dati sul DB/Bucket
    globalStore.startLoading();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    globalStore.stopLoading();
    currentStep.value = 1;
    mangaToShow.value = [];
    mangadexTitle.value = "";
    imageList.value = [];
    dialogCopertinaNomeENumero.value = false;
    return;
  }

  currentStep.value++;
  if (currentStep.value === 2) {
    //do a fake fetch for 2 second
    globalStore.startLoading();
    await fetchManga();
    globalStore.stopLoading();
  }
};

const fetchManga = async () => {
  mangaToShow.value = [];
  if (titoloENumero.value.titolo === "" || titoloENumero.value.numero === 0) {
    globalStore.showSnackbar("Inserisci titolo e numero", "error");
    return;
  }

  const baseUrl = "https://api.mangadex.org";
  globalStore.startLoading();
  const { data, total } = await $fetch<MangadexManga>(`${baseUrl}/manga`, {
    method: "GET",
    params: {
      title: titoloENumero.value.titolo,
      limit: 10,
    },
  });
  globalStore.stopLoading();
  if (total === 0) {
    globalStore.showSnackbar("Nessun manga trovato", "warn");
    return;
  }

  if (total === 1) {
    await fetchCopertine(data[0].id);
    return;
  }

  //procede a chiedere all'utente quale manga vuole vedere
  mangaToShow.value = data.map((manga) => ({
    id: manga.id,
    title: manga.attributes.title.en,
  }));
  mangadexTitle.value = mangaToShow.value[0].title;
  multiManga.value = true;
};

const fetchCopertine = async (mangaId: string) => {
  const imageBaseUrl = "https://uploads.mangadex.org/covers";
  const baseUrl = "https://api.mangadex.org";
  const resp = await $fetch<any>(
    `${baseUrl}/cover?manga[]=${mangaId}&limit=50&offset=${
      titoloENumero.value.numero - 1
    }&order[volume]=asc`
  );
  resp.data.forEach((data: any) => {
    imageList.value.push({
      image: `${imageBaseUrl}/${mangaId}/${data.attributes.fileName}.256.jpg`,
      idCopertina: data.id,
    });
  });
};

type MangaToShow = {
  id: string;
  title: string;
};

type MangaToShowImage = {
  idCopertina: string;
  image: string;
};
const mangaToShow = useState<MangaToShow[]>(() => []);
const multiManga = useState(() => false);
const mangadexTitle = useState(() => "");
const imageList = useState<MangaToShowImage[]>(() => []);
const immagineScelta = useState<MangaToShowImage>(() => ({
  idCopertina: "",
  image: "",
}));
const titleSelection = async () => {
  const manga: MangaToShow = mangaToShow.value.find(
    (m) => m.title === mangadexTitle.value
  )!;
  await fetchCopertine(manga.id);
  multiManga.value = false;
};

const display = useDisplay();

const scegliCopertina = (copertina: MangaToShowImage) => {
  immagineScelta.value = copertina;
  nextStep();
};
</script>

<template>
  <VBtn @click="dialogCopertinaNomeENumero = true">Apri</VBtn>
  <VDialog v-model="dialogCopertinaNomeENumero" fullscreen persistent>
    <VCard class="h-100">
      <VContainer>
        <VRow class="text-center">
          <VCol v-if="currentStep === 1">Titolo e numero</VCol>
          <VCol v-else-if="currentStep === 2">Scegli la copertina</VCol>
          <VCol v-else>Conferma</VCol>
        </VRow>
        <!-- CONTAINER DEGLI STEP -->
        <VRow
          :style="{
            maxHeight: display.height.value - 100 + 'px',
            overflowY: 'scroll',
          }"
          class="mt-4"
        >
          <VCol v-if="currentStep === 1">
            <VTextField
              v-model="titoloENumero.titolo"
              label="Titolo"
              variant="outlined"
            />
            <VTextField
              v-model="titoloENumero.numero"
              label="Numero"
              variant="outlined"
            />
          </VCol>
          <VCol
            cols="6"
            v-else-if="currentStep === 2"
            v-for="(image, i) in imageList"
          >
            <VCard link hover elevation="24" @click="scegliCopertina(image)">
              <VImg :src="image.image" />
            </VCard>
          </VCol>
          <VCol cols="6" v-else>
            <VCard>
              <VImg :src="immagineScelta.image" />
              <VCardTitle>{{ titoloENumero.titolo }}</VCardTitle>
            </VCard>
          </VCol>
        </VRow>

        <!-- RIGA DELLE AZIONI -->
        <VRow
          class="justify-space-between mt-8"
          :style="{ display: currentStep == 2 ? 'none' : '' }"
        >
          <VCol cols="4" class="text-center">
            <VBtn
              :disabled="currentStep === 1 || globalStore.isLoading"
              @click="currentStep--"
              >PREV</VBtn
            >
          </VCol>
          <VCol cols="4" class="text-center">
            <VBtn @click="nextStep" :disabled="globalStore.isLoading">{{
              currentStep < 3 ? "NEXT" : "END"
            }}</VBtn>
          </VCol>
        </VRow>
      </VContainer>
    </VCard>
  </VDialog>

  <VDialog v-model="multiManga" persistent>
    <VCard rounded="lg">
      <VCardTitle class="text-center"
        >Mangadex found {{ mangaToShow.length }} manga</VCardTitle
      >
      <VContainer>
        <VRow>
          <VCol>
            <VSelect
              variant="outlined"
              label="Title"
              :items="mangaToShow.map((m) => m.title)"
              v-model="mangadexTitle"
            />
          </VCol>
        </VRow>
      </VContainer>
      <VCardActions>
        <VBtn @click="titleSelection">Save</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.debug {
  border: 2px solid red;
}
</style>
