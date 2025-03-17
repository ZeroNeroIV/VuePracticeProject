<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <v-card class="mx-auto" elevation="8">
          <v-card-item>
            <v-card-title class="text-h4 text-primary text-center mb-4">
              Welcome to Vue Practice Project!
            </v-card-title>
            <v-card-subtitle class="text-subtitle-1 text-center mb-6">
              Learn Vue.js with TypeScript, Router, Pinia, and Vuetify
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-container>
              <p class="mb-4">
                This application demonstrates the core concepts of Vue.js including:
              </p>
              <v-list>
                <v-list-item v-for="(item, i) in features" :key="i" :value="item">
                  <template v-slot:prepend>
                    <v-icon color="primary" icon="mdi-check-circle"></v-icon>
                  </template>
                  <v-list-item-title>{{ item }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-container>
          </v-card-text>

          <v-card-actions class="justify-center pa-6">
            <v-btn color="primary" size="large" variant="elevated" @click="navigateToAuth">
              Try Now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomePage',
  setup() {
    const router = useRouter()

    const features = ref([
      'TypeScript integration for type safety',
      'Vue Router for navigation',
      'Pinia for state management',
      'Vuetify for Material Design components',
      'Component composition with the Composition API',
    ])

    // Function to navigate to the auth page
    const navigateToAuth = (): void => {
      router.push('/auth')
    }

    return {
      features,
      navigateToAuth,
    }
  },
})
</script>
