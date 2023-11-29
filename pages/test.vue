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
  const resp = await useFetch("/api/test")
  console.log(resp)
}
</script>

<template>
  <button @click="f">fetch</button>
</template>