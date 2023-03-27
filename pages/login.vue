<script setup lang="ts">
import Login from "~~/interface/login";

const userLogin = useState<Login>("userLogin", () => {
  return {
    email: "",
    password: "",
  };
});
const error = useState(() => "");
const isLoading = useState(() => false);

const handleSubmit = async () => {
  try {
    const user = await login(userLogin.value);
    console.log("user: ", user);
  } catch (error: any) {
    console.log(
      "error: ",
      error.message,
      error.statusCode,
      error.statusMessage
    );
  }
};
</script>

<template>
  <div class="page">
    <VSheet>
      <VForm @submit.prevent="handleSubmit">
        <h1 class="title">Login</h1>
        <div class="input-separator">
          <VTextField
            type="email"
            v-model="userLogin.email"
            label="Email"
            outlined
            required
          ></VTextField>
        </div>
        <div class="input-separator">
          <VTextField
            type="password"
            v-model="userLogin.password"
            label="Password"
            outlined
            required
          />
        </div>
        <div class="div-submit-btn">
          <VBtn type="submit" color="primary" variant="tonal" rounded
            >Login</VBtn
          >
        </div>
      </VForm>
    </VSheet>
  </div>
</template>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.v-sheet {
  margin: auto;
  height: 50vh;
  width: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
}

.v-form {
  width: 50%;
}

.title {
  text-align: center;
}

.input-separator {
  margin: 10px;
}
.div-submit-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
