<script setup lang="ts">
const booksStore = useBooksStore();
const globalStore = useGlobalStore();

type FormData = {
  title: string;
  volume: number;
  price: number;
};

const useBookInShelf = useState(() => false);

// lista di libri aggiunti al momento
const listAdded = useState<FormData[]>(() => []);

// lista di libri presi dal db
const listFromServer = useState<FormData[]>(() => []);

const formData = useState<FormData>(() => ({
  title: "",
  volume: 1,
  price: 1,
}));

const updateOtherValue = (title: string) => {
  const book = booksStore.books.find((book) => book.title === title);
  if (book) {
    formData.value.volume = book.purchased + 1;
    formData.value.price = book.price;
  } else {
    formData.value.volume = 1;
    formData.value.price = 1;
  }
};

const validate = () => {
  if (
    formData.value.title === "" ||
    formData.value.price === 0 ||
    formData.value.volume === 0
  ) {
    alert("Errore, il titolo non può essere vuoto");
    return;
  }
  const booksFromServer = listFromServer.value.find(
    (book) =>
      book.title === formData.value.title &&
      (book.volume === formData.value.volume ||
        book.volume > formData.value.volume) &&
      book.price === formData.value.price
  );
  if (booksFromServer) {
    alert("Errore, il libro è già presente nel db");
    return;
  }

  const booksAdded = listAdded.value.find(
    (book) =>
      book.title === formData.value.title &&
      (book.volume === formData.value.volume ||
        book.volume > formData.value.volume) &&
      book.price === formData.value.price
  );
  if (booksAdded) {
    alert("Errore, il libro è già stato aggiunto");
    return;
  }
  listAdded.value.push({ ...formData.value });
};

const fakeSave = async () => {
  await new Promise<void>((resolve) => {
    globalStore.startLoading();
    setTimeout(() => {
      globalStore.stopLoading();
      listFromServer.value = [...listAdded.value];
      listAdded.value = [];
      resolve();
    }, 3000);
  });
};

const fakeDelete = async (title: string) => {
  await new Promise<void>((resolve) => {
    globalStore.startLoading();
    setTimeout(() => {
      globalStore.stopLoading();
      listFromServer.value = listFromServer.value.filter(
        (book) => book.title !== title
      );
      resolve();
    }, 3000);
  });
};
</script>

<template>
  <VContainer>
    <VRow justify="center">
      <VCol>
        <VCard>
          <VCardTitle class="text-center">Next to buy</VCardTitle>
          <VCardText>
            <VRow>
              <VCol cols="8">
                <VAutocomplete
                  v-if="useBookInShelf"
                  v-model="formData.title"
                  label="title"
                  variant="outlined"
                  :items="
                    booksStore.books
                      .filter((book) => book.status !== 'Completed')
                      .map((book) => book.title)
                  "
                  @update:model-value="(title: string) => updateOtherValue(title)"
                />
                <VTextField
                  v-else
                  v-model="formData.title"
                  label="title"
                  variant="outlined"
                  clearable
                />
              </VCol>
              <VCol cols="4">
                <VSwitch v-model="useBookInShelf" label="Use shelf" />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model.number="formData.volume"
                  label="number of the volume"
                  type="number"
                  variant="outlined"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model.number="formData.price"
                  label="price"
                  type="number"
                  append-inner-icon="mdi-currency-eur"
                  variant="outlined"
                />
              </VCol>
            </VRow>
            <VCardActions class="justify-center">
              <VBtn color="primary" size="x-large" @click="validate">
                <VIcon>mdi-plus</VIcon>
              </VBtn>
              <VBtn
                :disabled="listAdded.length === 0"
                :color="listAdded.length !== 0 ? 'success' : 'default'"
                @click="fakeSave"
                >Save the list
                <VIcon class="ml-1">mdi-floppy</VIcon>
              </VBtn>
            </VCardActions>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol cols="6" v-for="books in listAdded">
        <VCard>
          <VCardTitle class="text-center">{{ books.title }}</VCardTitle>
          <VCardText>
            <p>Volume: {{ books.volume }}</p>
            <p>Price: {{ books.price }} €</p>
          </VCardText>
          <VCardActions class="justify-center">
            <VBtn
              color="error"
              @click="listAdded.splice(listAdded.indexOf(books), 1)"
            >
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol cols="6" v-for="books in listFromServer">
        <VCard>
          <VCardTitle class="text-center">{{ books.title }}</VCardTitle>
          <VCardText>
            <p>Volume: {{ books.volume }}</p>
            <p>Price: {{ books.price }} €</p>
          </VCardText>
          <VCardActions class="justify-center">
            <VBtn
              color="error"
              @click="fakeDelete(books.title)"
              >Ma da server
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>

<style>
html {
  overflow-y: scroll;
}
</style>
