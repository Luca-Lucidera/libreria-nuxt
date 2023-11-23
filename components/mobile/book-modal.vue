<script setup lang="ts">
import type { Book } from "~/types/book";
type Props = {
  book: Book;
  openModal: boolean;
  test: boolean;
};

type Emits = {
  closeModal: [value: boolean];
  updateBook: [book: Book];
  createBook: [book: Book];
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

//STORE
const tableStore = useTableStore();

//COMPUTED
const status = computed(() =>
  tableStore.filters?.status.filter((s: string) => s !== "All")
);
const type = computed(() =>
  tableStore.filters?.type.filter((s: string) => s !== "All")
);
const publisher = computed(() =>
  tableStore.filters?.publisher.filter((s: string) => s !== "All")
);

const open = computed(() => props.openModal);

const modifica = useState(() => false);
const bookToChange = computed(() => props.book);

const updateOrCreate = () => {
  if (props.book.id !== "") {
    emits("updateBook", bookToChange.value);
  } else {
    emits("createBook", bookToChange.value);
  }
};

const colors = [
  "#03a9f4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#e91e63",
  "#00bcd4",
];
</script>

<template>
  <VDialog
    v-if="!props.test"
    v-model="open"
    @update:model-value="emits('closeModal', false)"
  >
    <VCard>
      <VCardTitle>{{ props.book.title }}</VCardTitle>
      <VCardText>
        <VTimeline density="compact" side="end" truncate-line="both">
          <template v-for="(item, key, i) in props.book">
            <VTimelineItem
              v-if="key !== 'id' && key !== 'title' && key !== 'image'"
              size="x-small"
              :key="i"
              line-inset="6"
              :dot-color="colors.at(i)"
            >
              <!-- make key first letter upper case -->
              {{ key.charAt(0).toUpperCase() + key.slice(1) }}: {{ item }}
            </VTimelineItem>
          </template>
        </VTimeline>
      </VCardText>
      <VCardActions class="justify-center">
        <VBtn
          @click="emits('closeModal', false)"
          size="x-large"
          color="primary"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-else v-model="open" fullscreen scrollable>
    <VCard>
      <VCardTitle class="elevation-10">
        <VRow>
          <VCol cols="auto">
            <VBtn
              variant="text"
              icon="mdi-arrow-left-circle"
              color="primary"
              @click="emits('closeModal', false)"
            />
          </VCol>
          <VCol align-self="center"> {{ props.book.title }}</VCol>
        </VRow>
      </VCardTitle>
      <VContainer class="mt-8">
        <VRow>
          <VCol>
            <VTextField
              label="Title"
              v-model="bookToChange.title"
              :rules="rules.book.title"
              variant="outlined"
              :disabled="!modifica"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextField
              variant="outlined"
              label="Purchased"
              v-model="props.book.purchased"
              :disabled="!modifica"
            />
          </VCol>
          <VCol>
            <VTextField
              variant="outlined"
              label="Read"
              v-model="props.book.read"
              :disabled="!modifica"
            />
          </VCol>
        </VRow>
        <VRow class="mt-0">
          <VCol class="text-center">
            <VBtn icon="mdi-minus" variant="plain" color="secondary" />
            <VBtn icon="mdi-plus" variant="plain" color="primary" />
          </VCol>
          <VCol class="text-center">
            <VBtn icon="mdi-minus" variant="plain" color="secondary" />
            <VBtn icon="mdi-plus" variant="plain" color="primary" />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VSelect
              label="Status"
              v-model="bookToChange.status"
              :items="status"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VSelect
              label="Type"
              v-model="bookToChange.type"
              :items="type"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
          <VCol>
            <VSelect
              label="Editor"
              v-model="bookToChange.publisher"
              :items="publisher"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextField
              type="number"
              label="Price"
              v-model.number="book.price"
              :rules="rules.book.price"
              :disabled="!modifica"
              variant="outlined"
              append-inner-icon="mdi-currency-eur"
            />
          </VCol>
          <VCol cols="4">
            <VBtn icon="mdi-minus" variant="plain" color="secondary" />
            <VBtn icon="mdi-plus" variant="plain" color="primary" />
          </VCol>
        </VRow>
        <VRow>
          <VCol>
            <VTextarea
              label="Comment"
              v-model="bookToChange.comment"
              :rules="rules.book.comment"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
        </VRow>
        <VRow class="mt-0">
          <VCol class="text-center">
            <VRating
              v-model="bookToChange.rating"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="text-center">
            <!-- 
              La procedura deve essere questa:
              1) l'utente preme il pulsante
              2) si apre un piccolo modal dove chiede se il titolo e il numero del volume sono corretti
              3) l'utente può cambiarli
              4) tramite il nome e il numero del volume va a fare il fetch dei data da mangadex
                 [guarda il tuo progetto (mangadex qualcosa nei file di code)]
              5) l'utente sceglie la copertina o torna indietro e cambia il titolo e il numero del volume
                 oppure inserisce lui manualmente l'immagine dicendo che l'immagine verrà associata al titolo e al numero del volume
              6) l'utente preme il pulsante per salvare
             -->
            <VBtn>
              Change image
            </VBtn>
          </VCol>
        </VRow>
      </VContainer>
      <VCardActions class="justify-space-evenly mb-8">
        <VBtn
          @click="modifica = !modifica"
          color="secondary"
          variant="text"
          icon="mdi-pencil"
          class="mr-2"
        />
        <VBtn
          :disabled="modifica"
          icon="mdi-content-save"
          variant="plain"
          color="primary"
          @click="updateOrCreate"
        />
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<style scoped>
.debug {
  border: 2px solid red;
}
</style>
