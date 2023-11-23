<script setup lang="ts">
import type { Book } from "~/types/book";
import { VForm } from "vuetify/components/VForm";
import { useTableStore } from "~/utils";

type Props = {
  openModal: boolean;
  book: Book;
};
type Emits = {
  createNewBook: [book: Book];
  updateBook: [book: Book];
  onlyClose: [];
};

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

//STORE
const tableStore = useTableStore();

//COMPUTED
const open = computed(() => props.openModal);
const bookToChange = computed(() => props.book);
const status = computed(() =>
  tableStore.filters?.status.filter((s: string) => s !== "All")
);
const type = computed(() =>
  tableStore.filters?.type.filter((s: string) => s !== "All")
);
const publisher = computed(() =>
  tableStore.filters?.publisher.filter((s: string) => s !== "All")
);
const displayTitle = computed(() =>
  props.book.id === "" ? "New book" : `Changing: ${props.book.title}`
);

//REF
const form = ref<InstanceType<typeof VForm> | null>(null as any);

async function handleSave() {
  const { valid } = await form!.value!.validate();
  if (!valid) return;
  if (props.book.id === "") {
    emit("createNewBook", bookToChange.value);
  } else {
    emit("updateBook", bookToChange.value);
  }
}
</script>

<template>
  <VDialog v-model="open" :persistent="true" width="70%" height="90%">
    <VCard>
      <VCardTitle>{{ displayTitle }}</VCardTitle>
      <VForm ref="form">
        <VCardText>
          <VContainer>
            <VRow>
              <VTextField
                label="Title"
                v-model="bookToChange.title"
                :rules="rules.book.title"
              />
            </VRow>
            <VRow>
              <VCol>
                <VTextField
                  type="number"
                  label="Buy"
                  v-model.number="bookToChange.purchased"
                  :rules="rules.book.buy"
                />
              </VCol>
              <VCol>
                <VTextField
                  type="number"
                  label="Read"
                  v-model.number="bookToChange.read"
                  :rules="rules.book.read(bookToChange.purchased)"
                />
              </VCol>
              <VCol>
                <VSelect
                  label="Status"
                  v-model="bookToChange.status"
                  :items="status"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VSelect
                  label="Type"
                  v-model="bookToChange.type"
                  :items="type"
                />
              </VCol>
              <VCol>
                <VSelect
                  label="Editor"
                  v-model="bookToChange.publisher"
                  :items="publisher"
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
                />
              </VCol>
              <VCol class="d-flex justify-center">
                <VRating
                  v-model="book.rating"
                  :max="5"
                  color="amber"
                  half-increments
                  :hover="true"
                  size="75"
                />
              </VCol>
            </VRow>
            <VRow>
              <VTextarea
                label="Comment"
                v-model="book.comment"
                :rules="rules.book.comment"
              />
            </VRow>
          </VContainer>
        </VCardText>
        <VCardActions class="justify-center mb-10">
          <VBtnGroup>
            <VBtn
              @click="handleSave"
              prepend-icon="mdi-floppy"
              color="success"
              variant="tonal"
              size="x-large"
              >SAVE
            </VBtn>
            <VBtn
              @click="emit('onlyClose')"
              prepend-icon="mdi-close"
              color="error"
              variant="tonal"
              size="x-large"
              >CLOSE
            </VBtn>
          </VBtnGroup>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>
