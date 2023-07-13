<script setup lang="ts">
import {UserRegisterDTO} from "~/types/user/userRegisterDTO";

const registerForm = useState<UserRegisterDTO>(() => {
  return {
    name: "",
    lastName: "",
    email: "",
    password: "",
  };
});
const error = useState(() => "");
const showPassword = useState(() => false);

const userStore = useUserStore();
const globalStore = useGlobalStore();

const handleSubmit = async () => {

  error.value = "";
  globalStore.startLoading();
  const result = await userStore.createUser(registerForm.value);
  if (result.success) {
    await useRouter().push("/");
    registerForm.value = {
      name: "",
      lastName: "",
      email: "",
      password: "",
    };
  } else {
    if(result.errorData) {
      error.value = result.errorData;
    } else {
      error.value = "Errore non previsto, riprovare più tardi"
    }
  }
}
</script>

<template>
  <VContainer class="h-100 d-flex align-center justify-center">
    <VCard class="w-50 rounded-xl">
      <VCardTitle class="text-center my-4 text-primary">REGISTER</VCardTitle>
      <VForm @submit.prevent="handleSubmit" ref="form">
        <VCardItem>
          <VTextField
              prependIcon="mdi-account-circle"
              label="First name"
              variant="underlined"
              color="primary"
              v-model="registerForm.name"
              :rules="rules.auth.name"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
              prependIcon="mdi-account-circle"
              label="Last name"
              variant="underlined"
              color="primary"
              v-model="registerForm.lastName"
              :rules="rules.auth.lastName"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
              prependIcon="mdi-email"
              type="email"
              label="Email"
              variant="underlined"
              color="primary"
              v-model="registerForm.email"
              :rules="rules.auth.email"
          />
        </VCardItem>
        <VCardItem>
          <VTextField
              label="Password"
              variant="underlined"
              prependIcon="mdi-lock"
              color="primary"
              v-model="registerForm.password"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="rules.auth.password"
              @click:append-inner="showPassword = !showPassword"
          />
        </VCardItem>
        <VCardText class="text-center text-error text-body-1">
          {{ error }}
        </VCardText>
        <VCardActions class="justify-center my-4">
          <VBtn
              type="submit"
              color="primary"
              variant="tonal"
              size="large"
              rounded="lg"
              elevation="18"
              width="auto"
          >
            REGISTER
          </VBtn>
          <VBtn
              color="secondary"
              variant="text"
              size="large"
              elevation="18"
              rounded="lg"
              width="auto"
              to="/login"
          >LOGIN
          </VBtn
          >
        </VCardActions>
      </VForm>
    </VCard>
  </VContainer>
</template>

