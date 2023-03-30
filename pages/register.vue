<script setup lang="ts">
import IRegister from "~~/interface/auth/register";

const registerForm = useState<IRegister>("register-form", () => {
  return {
    name: "",
    lastName: "",
    email: "",
    password: "",
  };
});
const isLoading = useState(() => false);
const error = useState(() => "");

const userStore = useUserStore();
const router = useRouter();

async function handleSubmit() {
  try {
    isLoading.value = true;
    error.value = "";
    await userStore.createUser(registerForm.value);
    await router.push("/");
  } catch (err) {
    if (err instanceof Error) {
      error.value = err.message;
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="page">
    <VSheet rounded="xl">
      <VForm @submit.prevent="handleSubmit">
        <h1 class="title">REGISTER</h1>
        <div class="input-separator">
          <VTextField
            type="email"
            v-model="registerForm.name"
            label="First name"
            outlined
            required
          ></VTextField>
        </div>
        <div class="input-separator">
          <VTextField
            v-model="registerForm.lastName"
            label="Last name"
            outlined
            required
          />
        </div>
        <div class="input-separator">
          <VTextField
            type="email"
            v-model="registerForm.email"
            label="Email"
            outlined
            required
          />
        </div>
        <div class="input-separator">
          <VTextField
            type="password"
            v-model="registerForm.password"
            label="Password"
            outlined
            required
          />
        </div>
        <div class="div-submit-btn">
          <VBtn type="submit" color="primary" variant="tonal" rounded
            >Register</VBtn
          >
        </div>

        <div class="m-top-10">
          <VBtn color="primary" variant="tonal">
            <NuxtLink to="/login">Login</NuxtLink>
          </VBtn>
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
  height: 70vh;
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
