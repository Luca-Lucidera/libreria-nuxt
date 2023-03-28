<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import { useBooksStore } from "~~/store/books.store";
import { useUserStore } from "~~/store/user.store";

const dialogTest = useState(() => false);

const error = useState(() => "");
const isLoading = useState(() => true);

const booksStore = useBooksStore();
const { filteredBooks } = booksStore;
const userStore = useUserStore();
const selectedFilter = useState("selected-filter", () => {
  return {
    type: "All",
    editor: "All",
    status: "All",
    search: "",
  };
});

let tableHeaders: any[] = [];

let tableFilter = {
  type: [] as string[],
  status: [] as string[],
  editor: [] as string[],
};

try {
  await booksStore.fetchBooks();
  tableHeaders = await fetchTableHeaders();
  const bookType = await getType()!;
  const bookStatus = await getStatus()!;
  const bookEditor = await getEditor()!;
  tableFilter = {
    type: bookType!.map((item) => item.name),
    status: bookStatus!.map((item) => item.name),
    editor: bookEditor!.map((item) => item.name),
  };
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
  <div v-if="booksStore.computedBooks.length === 0">
    No books found, add one
  </div>
  <div v-else>
    <VLayout class="page-height">
      <VAppBar elevation="12">
        <VAppBarNavIcon>
          <VBtn color="primary" icon="mdi-account-circle" />
        </VAppBarNavIcon>
        <VAppBarTitle
          >Your library {{ userStore.computedUser?.name }}</VAppBarTitle
        >
        <VBtn icon="mdi-logout" />
      </VAppBar>
      <VMain>
        <VContainer class="full-height">
          <VRow align="center" class="full-height">
            <VCol cols="2">
              <VAutocomplete
                label="Type"
                :items="tableFilter.type"
                v-model="selectedFilter.type"
              />
              <VAutocomplete
                label="Editor"
                :items="tableFilter.editor"
                v-model="selectedFilter.editor"
              />
              <VAutocomplete
                label="Status"
                :items="tableFilter.status"
                v-model="selectedFilter.status"
              />
            </VCol>
            <VCol>
              <VDataTable
                :headers="tableHeaders"
                :items="
                  filteredBooks(
                    selectedFilter.type,
                    selectedFilter.editor,
                    selectedFilter.status
                  )
                "
                :search="selectedFilter.search"
                fixed-header
                fixed-footer
                height="70vh"
              >
                <template v-slot:top>
                  <VToolbar>
                    <VToolbarTitle>Books</VToolbarTitle>
                    <VTextField
                      v-model="selectedFilter.search"
                      label="Search title"
                      single-line
                      hide-details
                      class="search-bar-spacing"
                    />
                    <VBtn color="secondary" variant="tonal">New Book</VBtn>
                  </VToolbar>
                </template>
                <template v-slot:item.price="{ item }">
                  {{ (item as any).raw.price }} €
                </template>
                <template v-slot:item.rating="{ item }">
                  <VRating
                    v-model="(item as any).raw.rating"
                    :max="5"
                    color="amber"
                    half-increments
                    readonly
                  />
                </template>
                <template v-slot:item.comments="{ item }">
                  <VBtn
                    icon="mdi-comment-outline"
                    color="primary"
                    variant="tonal"
                  />
                </template>
                <template v-slot:item.action="{ item }">
                  <VBtnGroup>
                    <VBtn icon="mdi-pencil" color="secondary" variant="tonal" />
                    <VBtn icon="mdi-delete" color="error" variant="tonal" />
                  </VBtnGroup>
                </template>
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
.search-bar-spacing {
  margin-right: 25vw;
}
</style>
