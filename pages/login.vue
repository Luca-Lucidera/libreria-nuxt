<script setup lang="ts">
import ILogin from "~~/interface/login";
import { useUserStore } from "~~/store/user.store";

const userLogin = useState<ILogin>("userLogin", () => {
  return {
    email: "",
    password: "",
  };
});
const error = useState(() => "");
const isLoading = useState(() => false);

const userStore = useUserStore();

const handleSubmit = async () => {
  try {
    error.value = "";
    isLoading.value = true;
    await userStore.authenticate(userLogin.value);
    const router = useRouter();
    router.push("/");
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="page">
    <VSheet rounded="xl">
      <VForm @submit.prevent="handleSubmit">
        <h1 class="title">LOGIN</h1>
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
        <div v-if="isLoading" class="m-top-10">
          <VProgressLinear indeterminate color="primary" />
        </div>
        <div v-if="error" class="m-top-10">
          <p class="error-message">{{ error }}</p>
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

.error-message {
  color: red;
  text-align: center;
}

.m-top-10 {
  margin-top: 10%;
}
</style>
