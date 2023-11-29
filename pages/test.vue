<script setup lang="ts">
// definePageMeta({
//   middleware: [
//     () => {
//       if (process.env.NODE_ENV === "production") {
//         return "/";
//       }
//     },
//   ],
// });
const f = async () => {
  const { data, error } = await useFetch("/api/test")
  console.log(data, error)
};
</script>

<template>
  <button @click="f">fetch</button>
</template>
