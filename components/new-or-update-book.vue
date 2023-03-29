<script setup lang="ts">
import IBook from "~~/interface/book/book";
import IFilter from "~~/interface/filter";
interface Props {
  openModal: boolean;
  book: IBook;
  status: IFilter[];
  type: IFilter[];
  editor: IFilter[];
}
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "createNewBook", book: IBook): void;
  (e: "updateBook", book: IBook): void;
  (e: "onlyClose"): void;
}>();

const open = computed(() => props.openModal);
const book = computed(() => props.book);
const status = computed(() => {
  return props.status.filter((s) => s.name !== "All").map((s) => s.name);
});
const type = computed(() => {
  return props.type.filter((s) => s.name !== "All").map((s) => s.name);
});
const editor = computed(() => {
  return props.editor.filter((s) => s.name !== "All").map((s) => s.name);
});
const rules = {
  title: [
    (value: string) => !!value || "Title is required",
    (value: string) =>
      value.length <= 50 || "Title must be less than 50 characters",
  ],
  buy: [
    (value: number) => !!value || "Buy is required",
    (value: number) => value <= 9999 || "Buy must be less than 9999",
    (value: number) => value >= 0 || "Buy must be greater than 0",
  ],
  read: [
    (value: number) => value >= 0 || "Read is required",
    (value: number) => value <= book.value.buy || "Read must be less than Buy",
  ],
  price: [
    (value: number) => !!value || "Price is required",
    (value: number) => value <= 9999 || "Price must be less than 9999",
    (value: number) => value >= 0 || "Price must be greater than 0",
  ],
  comment: [
    (value: string) =>
      value.length <= 500 || "Comment must be less than 500 characters",
  ],
};

const form = ref(null as any);
async function handleSave() {
  const { valid } = await form.value.validate();
  if (!valid) {
    return;
  } 
  if (props.book.id === "") {
    emit("createNewBook", book.value);
  } else {
    emit("updateBook", book.value);
  }
}
</script>

<template>
  <VDialog v-model="open" persistent width="70%" height="90%">
    <VCard>
      <VCardTitle>{{
        props.book.id === "" ? "Nuovo libro" : `Modifiche a ${props.book.title}`
      }}</VCardTitle>
      <VForm ref="form">
        <VCardText>
          <VContainer>
            <VRow>
              <VTextField
                label="Title"
                v-model="book.title"
                :rules="rules.title"
              />
            </VRow>
            <VRow>
              <VCol>
                <VTextField
                  type="number"
                  label="Buy"
                  v-model.number="book.buy"
                  :rules="rules.buy"
                />
              </VCol>
              <VCol>
                <VTextField
                  type="number"
                  label="Read"
                  v-model.number="book.read"
                  :rules="rules.read"
                />
              </VCol>
              <VCol>
                <VSelect label="Status" v-model="book.status" :items="status" />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VSelect label="Type" v-model="book.type" :items="type" />
              </VCol>
              <VCol>
                <VSelect label="Editor" v-model="book.editor" :items="editor" />
              </VCol>
            </VRow>
            <VRow>
              <VCol>
                <VTextField
                  type="number"
                  label="Price"
                  v-model.number="book.price"
                  :rules="rules.price"
                />
              </VCol>
              <VCol class="d-flex justify-center">
                <VRating
                  v-model="book.rating"
                  :max="5"
                  color="amber"
                  half-increments
                  hover
                  size="75"
                />
              </VCol>
            </VRow>
            <VRow>
              <VTextarea
                label="Comment"
                v-model="book.comment"
                :rules="rules.comment"
              />
            </VRow>
          </VContainer>
        </VCardText>
        <VCardActions class="justify-center mb-10">
          <VBtnGroup>
            <VBtn
              @click="emit('onlyClose')"
              prepend-icon="mdi-close"
              color="error"
              variant="tonal"
              size="x-large"
              >CLOSE</VBtn
            >
            <VBtn
              @click="handleSave"
              prepend-icon="mdi-floppy"
              color="secondary"
              variant="tonal"
              size="x-large"
              >SAVE</VBtn
            >
          </VBtnGroup>
        </VCardActions>
      </VForm>
    </VCard>
  </VDialog>
</template>
