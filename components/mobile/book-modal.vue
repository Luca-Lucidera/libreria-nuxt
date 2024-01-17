<script setup lang="ts">
import type { Book } from "~/types/book";


const props = defineProps<{ book: Book }>();
const emits = defineEmits(['closeBookModal']);

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

const openBookModal = defineModel<boolean>();

const modifica = useState(() => false);

const bookToShow = ref(props.book);

const onCloseModal = () => {
  if (modifica.value) {
    modifica.value = false;
  }
  openBookModal.value = false;
  emits("closeBookModal");
};

// DIALOG PER LA copertina
const openBookCoverModal = useState(() => false);
</script>

<template>
  <VDialog v-model="openBookModal" fullscreen scrollable>
    <VCard>
      <VCardTitle class="elevation-10">
        <VRow>
          <VCol cols="auto">
            <VBtn
              variant="text"
              icon="mdi-arrow-left-circle"
              color="primary"
              @click="onCloseModal"
            />
          </VCol>
          <VCol align-self="center"> {{ bookToShow.title }}</VCol>
        </VRow>
      </VCardTitle>
      <VContainer class="mt-8">
        <VRow>
          <VCol>
            <VTextField
              label="Title"
              v-model="props.book.title"
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
              v-model="bookToShow.purchased"
              :disabled="!modifica"
            />
          </VCol>
          <VCol>
            <VTextField
              variant="outlined"
              label="Read"
              v-model="bookToShow.read"
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
              v-model="bookToShow.status"
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
              v-model="bookToShow.type"
              :items="type"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
          <VCol>
            <VSelect
              label="Editor"
              v-model="bookToShow.publisher"
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
              v-model.number="bookToShow.price"
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
              v-model="bookToShow.comment"
              :rules="rules.book.comment"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
        </VRow>
        <VRow class="mt-0">
          <VCol class="text-center">
            <VRating
              v-model="bookToShow.rating"
              :disabled="!modifica"
              variant="outlined"
            />
          </VCol>
        </VRow>
        <VRow>
          <VCol class="text-center">
            <VBtn
              @click="openBookCoverModal = true"
              :disabled="!modifica"
              variant="outlined"
            >
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
          @click="() => console.log('hello world')"
        />
      </VCardActions>
    </VCard>
  </VDialog>
  <MobileCoverModal
    v-if="openBookCoverModal"
    v-model="openBookCoverModal"
    :number="bookToShow.purchased"
    :title="bookToShow.title"
  />
</template>
