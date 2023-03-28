<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { useBooksStore } from "~~/store/books.store";
import { useUserStore } from "~~/store/user.store";

const error = useState(() => "");
const isLoading = useState(() => true);
const booksStore = useBooksStore();
const userStore = useUserStore();
let tableHeaders: any[] = [];
try {
  await booksStore.fetchBooks();
  tableHeaders = await fetchTableHeaders();
} catch (err) {
  if (err instanceof Error) {
    error.value = err.message;
  }
} finally {
  isLoading.value = false;
}
</script>

<template>
  <FullPageProgressBar v-if="isLoading" />
  <div v-else-if="error">Error while loading the books: {{ error }}</div>
  <div v-else-if="booksStore.computedBooks.length === 0">
    No books found, add one
  </div>
  <div v-else>
    <VLayout class="page-height">
      <VAppBar elevation="12">
        <VAppBarNavIcon>
          <VBtn color="primary">
            <VIcon icon="mdi-account-circle" />
          </VBtn>
        </VAppBarNavIcon>
        <VAppBarTitle
          >Your library {{ userStore.computedUser?.name }}</VAppBarTitle
        >
        <VBtn icon="mdi-logout" />
      </VAppBar>
      <VMain>
        <VContainer class="full-height">
          <VRow align="center" class="full-height">
            <VCol class="debug" cols="2">Colonna coi filtri + piccola</VCol>
            <VCol class="debug">
              <VDataTable
                :headers="tableHeaders"
                :items="booksStore.computedBooks"
                height="80%"
              >
              </VDataTable>
            </VCol>
          </VRow>
        </VContainer>
      </VMain>
    </VLayout>
  </div>
</template>

<style scoped>
.page-height {
  height: 100vh;
}
.full-height {
  height: 100%;
}

.debug {
  border: 2px solid red;
}
</style>
