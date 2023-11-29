<script setup lang="ts">
import { useDisplay } from "vuetify";
import type { MangadexCover } from "~/types/book/Mangadex/cover";
import type { MangadexManga } from "~/types/book/Mangadex/manga";
import type {
  MangaToShowTitle,
  MangaToShowImage,
} from "~/types/book/mangaToShow";
type Props = {
  title: string;
  number: number;
  open: boolean;
};

type Emits = {
  closeModal: [value: boolean];
};
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const title = useState(() => props.title);
const number = useState(() => props.number);
const openBaseDialog = computed(() => props.open);

//COMPUTED
const maxHeightScrollContainer = computed(() => height.value - 100 + "px");
const buttonText = computed(() => {
  switch (currentStep.value) {
    case 1:
      return "NEXT";
    case 2:
      return "GO WITH DEFAULT";
    case 3:
      return "CONFIRM";
    default:
      return "NEXT";
  }
});

//STORE
const globalStore = useGlobalStore();

//STATE GENERALE
const { height } = useDisplay();
const currentStep = useState(() => 1);

//PRE STEP 2
const dialogMultiMangaFound = useState(() => false);
const listAvailableTitle = useState<MangaToShowTitle[]>(() => []);
const defaultMangadexTitle = useState(() => "");

//STEP 2
const imageList = useState<MangaToShowImage[]>(() => []);
const imageSelected = useState<MangaToShowImage>(() => ({
  idCopertina: "",
  image: "empty.png",
}));

//METHODS
const nextStep = async () => {
  //procedura per chiudere il dialog e salvare i dati
  if (currentStep.value === 3) {
    globalStore.startLoading();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    globalStore.stopLoading();

    //FULL RESET
    currentStep.value = 1;
    listAvailableTitle.value = [];
    defaultMangadexTitle.value = "";
    imageList.value = [];
    imageSelected.value = {
      idCopertina: "",
      image: "empty.png",
    };
    return;
  }
  currentStep.value++;
  if (currentStep.value === 2) {
    globalStore.startLoading();
    await fetchManga();
    globalStore.stopLoading();
  }
};

const prevStep = () => {
  if (currentStep.value === 1) return;
  if (currentStep.value === 2) {
    listAvailableTitle.value = [];
    defaultMangadexTitle.value = "";
    imageList.value = [];
  }
  if (currentStep.value === 3) {
    imageSelected.value = {
      idCopertina: "",
      image: "empty.png",
    };
  }
  currentStep.value--;
};

const titleSelection = async () => {
  const manga: MangaToShowTitle = listAvailableTitle.value.find(
    (m) => m.title === defaultMangadexTitle.value
  )!;
  await fetchCopertine(manga.id);
  dialogMultiMangaFound.value = false;
};

const fetchManga = async () => {
  const url = mangadexBaseUrlApi + "/manga";
  const params = {
    title: title.value,
    limit: 10,
  };
  globalStore.startLoading();
  try {
    const { data, total } = await $fetch<MangadexManga>(url, {
      params
    });
    if (total === 0) {
      globalStore.showSnackbar("Nessun manga trovato", "warn");
      return;
    }
    //se trovo un solo manga skippo il dialog con la scelta del manga (prova con un qualsiasi volume unico)
    if (total === 1) {
      await fetchCopertine(data[0].id);
      return;
    }

    listAvailableTitle.value = data.map((manga) => {
      return {
        id: manga.id,
        title: manga.attributes.title.en,
      };
    });
    defaultMangadexTitle.value = listAvailableTitle.value[0].title;
    dialogMultiMangaFound.value = true;
  } catch (e) {
    console.debug(e);
  } finally {
    globalStore.stopLoading();
  }
};

const fetchCopertine = async (mangaId: string) => {
  const urlParams = {
    mangaArray: `manga[]=${mangaId}`,
    limit: "limit=50",
    offset: "offset=" + (number.value - 1),
    order: "order[volume]=asc",
  };
  const url =
    mangadexBaseUrlApi + "/cover?" + Object.values(urlParams).join("&");
  try {
    globalStore.startLoading();
    //add cors
    const { data: coverList } = await $fetch<MangadexCover>(url);
    imageList.value = coverList.map((cover) => {
      return {
        idCopertina: cover.id,
        image: `${mangadexBaseUrlImageApi}/${mangaId}/${cover.attributes.fileName}.256.jpg`,
      };
    });
  } catch (error) {
    console.debug(error);
  } finally {
    globalStore.stopLoading();
  }
};

const chooseImage = (image: MangaToShowImage) => {
  imageSelected.value = image;
  nextStep();
};
</script>

<template>
  <VDialog v-model="openBaseDialog" fullscreen persistent>
    <VCard class="h-100">
      <VContainer>
        <!-- HEADER -->
        <VRow class="elevation-10">
          <VCol cols="auto">
            <VBtn
              variant="text"
              icon="mdi-arrow-left-circle"
              color="primary"
              @click="emits('closeModal', false)"
            />
          </VCol>
          <VCol v-if="currentStep === 1" align-self="center" cols="auto"
            >Titolo e numero</VCol
          >
          <VCol v-else-if="currentStep === 2" align-self="center" cols="auto"
            >Scegli la copertina</VCol
          >
          <VCol v-else align-self="center" cols="auto">Conferma</VCol>
        </VRow>

        <!-- BODY -->
        <VRow
          :style="{ maxHeight: maxHeightScrollContainer, overflowY: 'scroll' }"
          class="mt-4"
          :justify="currentStep === 3 ? 'center' : 'start'"
        >
          <VCol v-if="currentStep === 1">
            <VTextField v-model="title" label="Titolo" variant="outlined" />
            <VTextField
              v-model.number="number"
              type="number"
              label="Numero"
              variant="outlined"
            />
          </VCol>
          <VCol
            cols="4"
            v-else-if="currentStep === 2"
            v-for="(image, i) in imageList"
          >
            <VCard link hover elevation="24" @click="chooseImage(image)">
              <VImg :src="image.image" />
            </VCard>
          </VCol>
          <VCol v-else cols="6">
            <VCard>
              <VImg :src="imageSelected.image" />
              <VCardTitle>{{ title }}</VCardTitle>
            </VCard>
          </VCol>
        </VRow>

        <!-- ACTIONS -->
        <VRow class="justify-space-around mt-8">
          <VCol class="text-center">
            <VBtn
              :disabled="currentStep === 1 || globalStore.isLoading"
              @click="prevStep"
              variant="outlined"
              color="secondary"
              >PREV</VBtn
            >
          </VCol>
          <VCol class="text-center">
            <VBtn
              @click="nextStep"
              :disabled="globalStore.isLoading"
              :text="buttonText"
              variant="tonal"
              color="primary"
            />
          </VCol>
        </VRow>
      </VContainer>
    </VCard>
  </VDialog>

  <VDialog v-model="dialogMultiMangaFound" persistent>
    <VCard rounded="lg">
      <VCardTitle class="text-center"
        >Mangadex found {{ listAvailableTitle.length }} manga</VCardTitle
      >
      <VContainer>
        <VRow>
          <VCol>
            <VSelect
              variant="outlined"
              label="Title"
              :items="listAvailableTitle.map((m) => m.title)"
              v-model="defaultMangadexTitle"
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
