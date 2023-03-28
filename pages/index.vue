<script setup lang="ts">
import { useUserStore } from "~~/store/user.store";

const userStore = useUserStore();
//const books = await getBooks()
</script>

<template>
  <div>
    logged {{ userStore.computedUser }}
  </div>
</template>
