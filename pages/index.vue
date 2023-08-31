<script setup lang="ts">
import { VForm } from "vuetify/lib/components/index.mjs";
import { useDisplay } from "vuetify";
import { BookToBuy } from "types/bookToBuy";

//state
const errors = useState<string[]>(() => []);

//store
const tableStore = useTableStore();
const globalStore = useGlobalStore();
const booksStore = useBooksStore();

const tab = ref(null);

onMounted(async () => {
  globalStore.startLoading();

  const resultFilters = await tableStore.fetchBooksTableFilters();
  if (!resultFilters.success) {
    if (resultFilters.errorData) {
      errors.value.push(resultFilters.errorData);
    }
  }

  const resultHeaders = await tableStore.fetchBooksTableHeaders();
  if (!resultHeaders.success) {
    if (resultHeaders.errorData) {
      errors.value.push(resultHeaders.errorData);
    }
  }

  const resultBooks = await booksStore.fetchBooks();
  if (!resultBooks.success) {
    if (resultBooks.errorData) {
      errors.value.push(resultBooks.errorData);
    }
  }

  globalStore.stopLoading();
});

//NUOVA SEZIONE DA SPOSTARE IN UN NUOVO COMPONENT

const useBookInShelf = useState(() => false);
const libroSelezionato = useState(() => ({
  title: "",
  number: 1,
  price: 1,
  isNew: true,
}));
const listaLibriDaComprare = useState<BookToBuy[]>(() => []);
const form = ref<InstanceType<typeof VForm> | null>(null as any);
const validateForm = () => {
  return form.value?.validate();
};

const addToList = () => {
  if (!validateForm()) return;
  const libro = listaLibriDaComprare.value.find(
    (l) => l.title === libroSelezionato.value.title
  );
  if (!libro) {
    listaLibriDaComprare.value.push(libroSelezionato.value);
    libroSelezionato.value = {
      title: "",
      number: 1,
      price: 1,
      isNew: true,
    };
    return;
  }
  listaLibriDaComprare.value.map((l) => {
    if (l.title === libroSelezionato.value.title) {
      l.number++;
    }
  });
};

const updateOtherFields = () => {
  const libro = booksStore.books.find(
    (b) => b.title === libroSelezionato.value.title
  );
  if (!libro) return;
  libroSelezionato.value.price = libro.price;
};

const removeFromList = (title: string) => {
  const i = listaLibriDaComprare.value.findIndex((l) => l.title === title);
  if (i === -1) return;
  listaLibriDaComprare.value.splice(i, 1);
};

const saveList = async () => {
  //check is new
  globalStore.startLoading();
  const aggiunti = listaLibriDaComprare.value.filter((l) => l.isNew === true);
  const data = await useFetch("/api/books/to-buy");
};

const cantSave = computed(() =>
  listaLibriDaComprare.value.every((l) => l.isNew === false)
);
</script>

<template>
  <!-- ERRORI -->
  <template v-if="errors.length != 0">
    <p v-for="error in errors" class="text-red">{{ error }}</p>
  </template>
  <VContainer v-else class="h-100">
    <VTabs v-model="tab" align-tabs="center" class="mb-8">
      <VTab value="home">
        <VIcon>mdi-home</VIcon>
        Home
      </VTab>
      <VTab value="next-to-buy">
        <VIcon>mdi-book</VIcon>
        Next to buy
      </VTab>
    </VTabs>
    <VWindow v-model="tab">
      <VWindowItem value="home">
        <HomePageTable v-if="!useDisplay().mobile.value" />
        <MobileBookList v-else />
      </VWindowItem>
      <VWindowItem value="next-to-buy">
        <VCol>
          <VRow justify="center">
            <VCard class="px-5 rounded-xl w-">
              <VForm ref="form" @submit.prevent="addToList">
                <VCardTitle class="text-center">Next to buy</VCardTitle>
                <VSwitch
                  v-model="useBookInShelf"
                  :label="`${
                    useBookInShelf ? 'use' : 'not use'
                  } books in the library`"
                  :color="useBookInShelf ? 'primary' : 'secondary'"
                />

                <VCol>
                  <VRow>
                    <VAutocomplete
                      v-if="useBookInShelf"
                      :items="booksStore.books.map((b) => b.title)"
                      variant="outlined"
                      label="Choose a title"
                      v-model="libroSelezionato.title"
                      :rules="rules.book.title"
                      @update:model-value="updateOtherFields"
                    />
                    <VTextField
                      v-else
                      v-model="libroSelezionato.title"
                      variant="outlined"
                      label="Title"
                      :rules="rules.book.title"
                    />
                  </VRow>
                  <VRow>
                    <VCol>
                      <VTextField
                        type="number"
                        label="Number of the volume"
                        variant="outlined"
                        v-model.number="libroSelezionato.number"
                        :rules="rules.book.number"
                      />
                    </VCol>
                    <VCol>
                      <VTextField
                        type="number"
                        label="Price of the volume"
                        variant="outlined"
                        v-model.number="libroSelezionato.price"
                        append-inner-icon="mdi-currency-eur"
                        :rules="rules.book.price"
                      />
                    </VCol>
                  </VRow>
                </VCol>
                <VCardActions class="justify-space-around">
                  <VBtn
                    color="primary"
                    variant="tonal"
                    class="mb-5"
                    type="submit"
                  >
                    <VIcon>mdi-plus</VIcon>
                    Add
                  </VBtn>
                  <VBtn color="success" variant="tonal" @click="saveList">
                    <VIcon>mdi-floppy</VIcon>
                    Save
                  </VBtn>
                </VCardActions>
              </VForm>
            </VCard>
          </VRow>
          <VRow justify="center" class="my-5 py-5">
            <VCol
              v-for="(libro, i) in listaLibriDaComprare"
              :key="i"
              cols="12"
              lg="4"
            >
              <VCard class="rounded-shaped">
                <VCardTitle class="text-center">{{ libro.title }}</VCardTitle>
                <VCardText class="text-center">
                  <p>Number: {{ libro.number }}</p>
                  <p>Price: {{ libro.price }}</p>
                </VCardText>
                <VCardActions class="justify-center">
                  <VBtn
                    :disabled="cantSave"
                    color="error"
                    variant="tonal"
                    @click="removeFromList(libro.title)"
                  >
                    <VIcon>mdi-delete</VIcon>
                    Delete
                  </VBtn>
                </VCardActions>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      </VWindowItem>
    </VWindow>
  </VContainer>
</template>
