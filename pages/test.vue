<script setup lang="ts">
definePageMeta({
  middleware: [
    () => {
      if (process.env.NODE_ENV === "production") {
        return "/";
      }
    },
  ],
});


</script>

<template>
  test page only to use in dev mode
</template>
