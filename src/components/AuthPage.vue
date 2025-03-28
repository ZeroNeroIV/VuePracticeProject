<template>
  <div class="auth-container">
    <div class="auth-content">
      <div class="auth-card">
        <div class="card-header">
          <h1 class="card-title">
            {{ isLogin ? 'Welcome Back' : 'Join Us' }}
          </h1>
        </div>

        <div class="card-body">
          <form @submit.prevent="handleSubmit">
            <div v-if="isLogin" class="form-group">
              <label for="identifier">Name or Email</label>
              <div class="input-group">
                <span class="input-icon">👤</span>
                <input
                  id="identifier"
                  v-model="identifier"
                  type="text"
                  required
                  @change="handleTextChange"
                />
              </div>
            </div>

            <div v-if="!isLogin" class="form-group">
              <label for="name">Name</label>
              <div class="input-group">
                <span class="input-icon">👤</span>
                <input
                  id="name"
                  v-model="name"
                  type="text"
                  required
                  @change="handleTextChange"
                />
              </div>
            </div>

            <div v-if="!isLogin" class="form-group">
              <label for="email">E-mail</label>
              <div class="input-group">
                <span class="input-icon">📧</span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  required
                  @change="handleTextChange"
                />
              </div>
            </div>

            <div class="form-group">
              <label for="password">Password</label>
              <div class="input-group">
                <span class="input-icon">🔒</span>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  required
                  @change="handleTextChange"
                />
              </div>
            </div>

            <div v-if="!isLogin" class="form-group">
              <label for="confirmPassword">Confirm Password</label>
              <div class="input-group">
                <span class="input-icon">🔒</span>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  type="password"
                  required
                  @change="handleTextChange"
                />
              </div>
            </div>

            <div v-if="authStore.authError" class="error-alert">
              {{ authStore.authError }}
              <button class="close-button" @click="handleTextChange">×</button>
            </div>

            <button
              type="submit"
              class="submit-button"
              :disabled="authStore.isLoading"
            >
              <span v-if="authStore.isLoading" class="loader"></span>
              <span v-else>{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
            </button>
          </form>
        </div>

        <div class="card-footer">
          <button
            class="toggle-button"
            @click="toggleAuthMode"
          >
            {{ isLogin ? 'New here? Create an account' : 'Already have an account? Sign in' }}
          </button>
        </div>
      </div>
    </div>
  </div>
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

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d3748 100%);
  padding: 20px;
}

.auth-content {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: #2d3748;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.card-header {
  padding: 24px 24px 0;
}

.card-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
  color: #ffffff;
}

.card-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #e2e8f0;
}

.input-group {
  display: flex;
  align-items: center;
  border: 1px solid #4a5568;
  border-radius: 8px;
  overflow: hidden;
  background: #1a202c;
}

.input-icon {
  padding: 8px;
  background: #2d3748;
  border-right: 1px solid #4a5568;
}

.input-group input {
  flex: 1;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 16px;
  background: #1a202c;
  color: #ffffff;
}

.error-alert {
  background: #742a2a;
  color: #feb2b2;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  position: relative;
}

.close-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  color: #feb2b2;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background: #3182ce;
}

.submit-button:disabled {
  background: #2c5282;
  cursor: not-allowed;
}

.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #ffffff;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.card-footer {
  padding: 0 24px 24px;
  text-align: center;
}

.toggle-button {
  background: none;
  border: none;
  color: #63b3ed;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.toggle-button:hover {
  color: #4299e1;
}
</style>
