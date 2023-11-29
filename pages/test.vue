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
  
</template>