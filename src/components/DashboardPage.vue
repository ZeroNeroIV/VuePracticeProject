<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12">
        <h1 class="text-h4 text-left mb-6">Dashboard</h1>
      </v-col>
    </v-row>

    <v-row v-if="authStore.user">
      <v-col cols="12">
        <v-card class="mb-6" color="grey-darken-4">
          <v-card-item>
            <v-card-title class="text-h5 text-primary"> User Dashboard </v-card-title>
            <v-card-subtitle class="mt-1">
              Hello,
              <strong> {{ authStore.user.name }} </strong>!
            </v-card-subtitle>
            <v-card-text class="mt-4 mb-4 mr-4 ml-4 text-center text-white">
              You are now logged in and can access all features of the application.
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <h2 class="text-h5 mb-4">Available Features</h2>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="(feature, index) in features" :key="index" cols="12" sm="6" md="3">
        <v-card height="100%" class="d-flex flex-column">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="primary" size="large" class="text-white">
                <v-icon :icon="feature.icon" size="large"></v-icon>
              </v-avatar>
            </template>
            <v-card-title>{{ feature.title }}</v-card-title>
          </v-card-item>

          <v-card-text>
            {{ feature.description }}
          </v-card-text>

          <v-card-actions class="mt-auto">
            <v-btn :to="feature.path" color="primary" variant="tonal" block> Access </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { title } from '@/main.ts'

interface Feature {
  title: string
  description: string
  icon: string
  path: string
}

export default defineComponent({
  name: 'MainPage',
  setup() {
    title.value = 'Dashboard'

    const router = useRouter()
    const authStore = useAuthStore()

    // Sample features data
    const features = ref<Feature[]>([
      {
        title: 'For You',
        description: 'View Reddit posts tailored for you',
        icon: 'mdi-view-dashboard',
        path: '/fyp',
      },
      {
        title: 'Settings',
        description: 'Configure your account settings',
        icon: 'mdi-cog',
        path: '/settings',
      },
    ])

    // Check if user is authenticated
    onMounted(() => {
      if (!authStore.isLoggedIn) {
        // Redirect to login if not authenticated
        router.push('/auth')
      }
    })

    return {
      features,
      authStore,
    }
  },
})
</script>
