<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="mx-auto" elevation="8">
          <v-card-item>
            <v-card-title class="text-h5 text-primary text-center">
              {{ isLogin ? 'Login' : 'Register' }}
            </v-card-title>
          </v-card-item>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field v-if="isLogin" v-model="identifier" label="Name or Email" type="text" required
                variant="outlined" prepend-inner-icon="mdi-account" full-width @change="handleTextChange" />

              <v-text-field v-if="!isLogin" v-model="name" label="Name" type="text" required variant="outlined"
                prepend-inner-icon="mdi-account" full-width @change="handleTextChange" />

              <v-text-field v-if="!isLogin" v-model="email" label="E-mail" type="email" required variant="outlined"
                prepend-inner-icon="mdi-email" full-width @change="handleTextChange" />

              <v-text-field v-model="password" label="Password" type="password" required variant="outlined"
                prepend-inner-icon="mdi-lock" full-width @change="handleTextChange" />

              <v-text-field v-if="!isLogin" v-model="confirmPassword" label="Confirm Password" type="password" required
                variant="outlined" prepend-inner-icon="mdi-account" full-width @change="handleTextChange" />

              <v-alert v-if="authStore.authError" type="error" variant="tonal" class="mt-4">
                {{ authStore.authError }}
              </v-alert>

              <v-btn type="submit" color="primary" block class="mt-4" size="large" :loading="authStore.isLoading">
                {{ isLogin ? 'Login' : 'Register' }}
              </v-btn>
            </v-form>
          </v-card-text>

          <v-card-actions class="justify-center pb-6">
            <v-btn variant="text" @click="toggleAuthMode" color="primary">
              {{ isLogin ? 'Create an account' : 'Login instead' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { title } from '@/main.ts'

export default defineComponent({
  name: 'AuthPage',
  setup() {
    title.value = 'Authentication'

    const isLogin = ref<boolean>(true)
    const identifier = ref('')
    const email = ref('')
    const name = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const router = useRouter()
    const authStore = useAuthStore()

    const toggleAuthMode = (): void => {
      isLogin.value = !isLogin.value
    }

    const handleSubmit = async (): Promise<void> => {
      if (!password.value) {
        authStore.authError = 'Please fill all provided fields.'
        return
      }

      let success: boolean

      if (isLogin.value) {
        success = await authStore.login({
          identifier: identifier.value,
          password: password.value,
        })
      } else {
        if (password.value !== confirmPassword.value) {
          authStore.authError = 'Passwords do not match.'
          return
        }
        if (!email.value) {
          authStore.authError = 'Please provide an email address.'
          return
        }
        if (!name.value) {
          authStore.authError = 'Please provide a name.'
          return
        }
        success = await authStore.register({
          name: name.value,
          email: email.value,
          password: password.value,
        })
      }

      if (success) {
        router.replace('/dashboard')
      }
    }

    const handleTextChange = (): void => {
      authStore.authError = null
    }

    return {
      isLogin,
      toggleAuthMode,
      handleSubmit,
      handleTextChange,
      router,
      authStore,
      identifier,
      email,
      name,
      password,
      confirmPassword,
    }
  },
})
</script>
