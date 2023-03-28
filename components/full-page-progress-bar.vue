<template>
  <div class="full-height">
    <div class="container-prog-bar">
      <h1>Caricamento</h1>
      <VProgressLinear color="primary" indeterminate height="12"/>
    </div>
  </div>
</template>

<style scoped>
.full-height {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center
}

.container-prog-bar {
  width: 50%;
  text-align: center;
}
</style>