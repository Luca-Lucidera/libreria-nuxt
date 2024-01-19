<script setup lang="ts">
import type { Book } from "~/types/book";
import { VForm } from "vuetify/components/VForm";

const props = defineProps<{ book: Book }>();
const emits = defineEmits(["closeBookModal"]);
const openBookModal = defineModel<boolean>();

//PROPS TO REF
const bookToShow = ref({ ...props.book });

//STORE
const tableStore = useTableStore();
const booksStore = useBooksStore();
const globalStore = useGlobalStore();

//STATE
const form = ref<InstanceType<typeof VForm> | null>(null as any);
const modifica = useState(() => false);

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

const onCloseModal = () => {
  if (modifica.value) {
    modifica.value = false;
  }
  openBookModal.value = false;
  emits("closeBookModal");
};

const updateBook = async () => {
  if (JSON.stringify(bookToShow.value) === JSON.stringify(props.book)) {
    return;
  }

  const { valid, errors } = await form!.value!.validate();
  if (!valid) {
    let allErrors = "";
    for (const error of errors) {
      allErrors += error.errorMessages + " | ";
    }
    globalStore.showSnackbar(allErrors, "error");
    return;
  }
  
  globalStore.startLoading();
  const result = await booksStore.updateBook(bookToShow.value);
  globalStore.stopLoading();
  
  if (!result.success) {
    globalStore.showSnackbar(result.errorData, "error");
    onCloseModal();
    return;
  }
  
  globalStore.showSnackbar("Book updated successfully", "success");
  onCloseModal();
};

// DIALOG PER LA copertina
const openBookCoverModal = useState(() => false);
</script>

<template>
  <VDialog v-model="openBookModal" fullscreen scrollable>
    <VForm ref="form">
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
            <VCol align-self="center"> {{ props.book.title }}</VCol>
          </VRow>
        </VCardTitle>
        <VContainer class="mt-8">
          <VRow>
            <VCol>
              <VTextField
                label="Title"
                v-model="bookToShow.title"
                variant="outlined"
                :rules="rules.book.title"
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
                :rules="rules.book.buy"
                :disabled="!modifica"
                readonly
              />
            </VCol>
            <VCol>
              <VTextField
                variant="outlined"
                label="Read"
                v-model="bookToShow.read"
                :rules="rules.book.read(bookToShow.purchased)"
                :disabled="!modifica"
                readonly
              />
            </VCol>
          </VRow>
          <VRow class="mt-0">
            <VCol class="text-center">
              <VBtn
                icon="mdi-minus"
                variant="plain"
                color="secondary"
                @click="bookToShow.purchased--"
              />
              <VBtn
                icon="mdi-plus"
                variant="plain"
                color="primary"
                @click="bookToShow.purchased++"
              />
            </VCol>
            <VCol class="text-center">
              <VBtn
                icon="mdi-minus"
                variant="plain"
                color="secondary"
                @click="bookToShow.read--"
              />
              <VBtn
                icon="mdi-plus"
                variant="plain"
                color="primary"
                @click="bookToShow.read++"
              />
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
                variant="outlined"
                :disabled="!modifica"
                half-increments
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
            @click="updateBook"
          />
        </VCardActions>
      </VCard>
    </VForm>
  </VDialog>
  <MobileCoverModal
    v-if="openBookCoverModal"
    v-model="openBookCoverModal"
    :number="bookToShow.purchased"
    :title="bookToShow.title"
  />
</template>
