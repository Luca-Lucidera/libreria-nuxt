<template>
  <VDialog v-model="open" persistent width="70%" height="90%">
    <VCard>
      <VCardTitle>{{
        props.book.id === "" ? "New book" : `Changing: ${props.book.title}`
      }}</VCardTitle>
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
                  v-model.number="bookToChange.buy"
                  :rules="rules.book.buy"
                />
              </VCol>
              <VCol>
                <VTextField
                  type="number"
                  label="Read"
                  v-model.number="bookToChange.read"
                  :rules="rules.book.read(bookToChange.buy)"
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
                  v-model="bookToChange.editor"
                  :items="editor"
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
                  hover
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
              color="success"
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
const bookToChange = computed(() => props.book);
const status = computed(() => {
  return props.status.filter((s) => s.name !== "All").map((s) => s.name);
});
const type = computed(() => {
  return props.type.filter((s) => s.name !== "All").map((s) => s.name);
});
const editor = computed(() => {
  return props.editor.filter((s) => s.name !== "All").map((s) => s.name);
});

const form = ref(null as any);
async function handleSave() {
  const { valid } = await form.value.validate();
  if (!valid) {
    return;
  }
  if (props.book.id === "") {
    emit("createNewBook", bookToChange.value);
  } else {
    emit("updateBook", bookToChange.value);
  }
}
</script>
