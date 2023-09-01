<script setup lang="ts">
import { Book } from "types/book";

const data = useState<Book[]>(() => []);

const loading = useState(() => false);

onMounted(() => {
  new Promise<void>((resolve) => {
    loading.value = true;
    setTimeout(() => {
      loading.value = false;
      data.value = [
        {
          id: "uuid-1",
          title: "Book 1",
          comment: "Comment 1",
          price: 10,
          publisher: "JPOP",
          purchased: 10,
          rating: 5,
          read: 10,
          status: "read",
          type: "manga",
        },
        {
          id: "uuid-2",
          title: "Book 2",
          comment: "Comment 2",
          price: 12,
          publisher: "Plant manga",
          purchased: 10,
          rating: 5,
          read: 12,
          status: "read",
          type: "manga",
        },
      ];
      resolve();
    }, 3000);
  });
});
</script>

<template>
  <VContainer style="border: red 3px solid">
    <VRow>
      <VCol cols="6">
        <VCard height="100%" hover class="d-flex flex-column">
          <VCardTitle>{{ data.at(0)?.title }}</VCardTitle>
          <VCardText class="d-flex flex-column justify-center py-0">
            <p>Purchased: {{ data.at(0)?.purchased }}</p>
            <p>Price: {{ data.at(0)?.price }}</p>
            <p>Publisher: {{ data.at(0)?.publisher }}</p>
          </VCardText>
          <VCardActions>
            <VBtn color="primary">
              <VIcon>mdi-book-open-outline</VIcon>
            </VBtn>
            <VBtn color="error">
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
      <VCol cols="6">
        <VCard height="100%" hover class="d-flex flex-column">
          <VCardTitle>{{ data.at(1)?.title }}</VCardTitle>
          <VCardText class="d-flex flex-column justify-center py-0">
            <p>Purchased: {{ data.at(1)?.purchased }}</p>
            <p>Price: {{ data.at(1)?.price }}</p>
            <p>Publisher: {{ data.at(1)?.publisher }}</p>
          </VCardText>
          <VCardActions>
            <VBtn color="primary">
              <VIcon>mdi-book-open-outline</VIcon>
            </VBtn>
            <VBtn color="error">
              <VIcon>mdi-delete</VIcon>
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>
    </VRow>
  </VContainer>
</template>
