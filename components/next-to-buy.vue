<script setup lang="ts">
import { BookToBuy } from "types/book/bookToBuy";
import { useDisplay } from "vuetify";
const booksStore = useBooksStore();
const globalStore = useGlobalStore();
const error = useState<null | string>(() => null);

const useBookInShelf = useState(() => false);

// lista di libri aggiunti al momento
const listAdded = useState<BookToBuy[]>(() => []);

// lista di libri presi dal db
const listFromServer = useState<BookToBuy[]>(() => []);

const formData = useState<BookToBuy>(() => ({
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

const validateLocal = () => {
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
  saveLocal(formData.value);
};

const saveLocal = (formData: BookToBuy) => {
  listAdded.value.push({ ...formData });
  localStorage.setItem("next-to-buy-local", JSON.stringify(listAdded.value));
};

const removeLocal = (formData: BookToBuy) => {
  listAdded.value = listAdded.value.filter(
    (book) =>
      book.title !== formData.title ||
      book.volume !== formData.volume ||
      book.price !== formData.price
  );
  localStorage.setItem("next-to-buy-local", JSON.stringify(listAdded.value));
};

const serverSave = async () => {
  globalStore.startLoading();
  const result = await booksStore.addBooksToBuy(listAdded.value);
  if(!result.success) {
    if(result.errorData) {
      error.value = result.errorData;
    } else {
      error.value = "Errore non gestito";
    }
  } else {
    listFromServer.value = [...listFromServer.value, ...listAdded.value];    
    listAdded.value = [];
    localStorage.removeItem("next-to-buy-local");
  }
  globalStore.stopLoading();
}

const serverRemove = async (formData: BookToBuy) => {
};


onMounted(async () => {
  globalStore.startLoading();
  const local = localStorage.getItem("next-to-buy-local");
  if (local) {
    listAdded.value = JSON.parse(local);
  }

  const result = await booksStore.fetchBooksToBuy();
  if(!result.success) {
    if(result.errorData) {
      error.value = result.errorData;
    } else {
      error.value = "Errore non gestito";
    }
  } else {
    if(result.successData) {
      listFromServer.value = result.successData;
    }
  }

  globalStore.stopLoading();
});
</script>

<template>
  <VContainer>
    <VRow>
      <VCol
        :class="{
          'd-flex': useDisplay().lgAndUp.value,
          'justify-center': useDisplay().lgAndUp.value,
        }"
      >
        <VCard
          :style="{ width: useDisplay().lgAndUp.value ? '50%' : '' }"
          rounded="lg"
        >
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
                <label>Use shelf</label>
                <VSwitch v-model="useBookInShelf" />
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
              <VBtn color="primary" size="x-large" @click="validateLocal">
                <VIcon>mdi-plus</VIcon>
              </VBtn>
              <VBtn
                :disabled="listAdded.length === 0"
                :color="listAdded.length !== 0 ? 'success' : 'default'"
                @click="serverSave"
                >Save the list
                <VIcon class="ml-1">mdi-floppy</VIcon>
              </VBtn>
            </VCardActions>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
    <VRow>
      <VCol xs="12" sm="6" md="4" lg="3" xl="2" v-for="book in listAdded">
        <VCard class="d-flex flex-column pulsing-container" rounded="lg">
          <VCardTitle class="text-center">{{ book.title }}</VCardTitle>
          <VCardText class="d-flex flex-column justify-center py-1 text-center">
            <p>Volume: {{ book.volume }}</p>
            <p>Price: {{ book.price }} €</p>
          </VCardText>
          <VCardActions class="justify-center">
            <VBtn color="error" @click="removeLocal(book)">
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol xs="12" sm="6" md="4" lg="3" xl="2" v-for="book in listFromServer">
        <VCard>
          <VCardTitle class="text-center">{{ book.title }}</VCardTitle>
          <VCardText>
            <p>Volume: {{ book.volume }}</p>
            <p>Price: {{ book.price }} €</p>
          </VCardText>
          <VCardActions class="justify-center">
            <VBtn color="error" @click="serverRemove(book)">
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

@keyframes pulse {
  0% {
    border-color: transparent;
    transform: scale(1);
  }
  50% {
    border-color: rgb(var(--v-theme-primary));
    transform: scale(1.02);
  }
  100% {
    border-color: transparent;
    transform: scale(1);
  }
}

.pulsing-container {
  border: 2px solid transparent;
  animation: pulse 2s infinite;
}
</style>
