<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar class="bg-transparent elevation-0">
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" variant="text" color="white">
        <v-icon left>mdi-home</v-icon>
        Home
      </v-btn>
      <v-btn to="/dashboard" variant="text" color="white">
        <v-icon left>mdi-file-document</v-icon>
        Dashboard
      </v-btn>
      <v-btn to="/fyp" variant="text" color="white">
        <v-icon left>mdi-view-dashboard</v-icon>
        For You
      </v-btn>
      <v-btn to="/settings" variant="text" color="white">
        <v-icon left>mdi-cog</v-icon>
        Settings
      </v-btn>
      <v-btn v-if="authStore.isLoggedIn" @click="handleLogout" variant="text" color="red">
        <v-icon left>mdi-logout</v-icon>
        Logout
      </v-btn>
      <v-btn v-else to="/auth" variant="text" color="white">
        <v-icon left>mdi-login</v-icon>
        Register/Login
      </v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="full-screen">
      <router-view v-if="!isLoading" />
      <div v-else>Loading...</div>
    </v-main>

    <!-- Footer -->
    <v-footer app class="bg-grey-darken-3">
      <v-container class="text-center"> &copy; 2025 Vue Practice App - Alameen Sabbah </v-container>
    </v-footer>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from './config/router-setup'
import { title } from '@/main.ts'

title.value = 'Vue Practice Project'

const authStore = useAuthStore()
const isLoading = ref<boolean>(false)

const handleMounting = async (): Promise<void> => {
  isLoading.value = true
  authStore.initAuth().then(() => {
    isLoading.value = false
  })
}

const handleLogout = async (): Promise<void> => {
  console.log('Logging out...')
  isLoading.value = true
  await authStore.logout()
  router.push('/')
  isLoading.value = false
  console.log('Logged out!')
}

onMounted(handleMounting)
</script>

<style>
.full-screen {
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
