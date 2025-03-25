<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1 class="main-title">Dashboard</h1>
    </header>

    <section v-if="authStore.user" class="welcome-card">
      <div class="welcome-content">
        <h2 class="welcome-title">Welcome Back!</h2>
        <div class="user-greeting">
          Hello, <strong>{{ authStore.user.name }}</strong>
        </div>
        <p class="welcome-message">
          Access all features and personalize your experience
        </p>
      </div>
    </section>

    <section class="features-section">
      <h2 class="features-title">Available Features</h2>

      <div class="features-grid">
        <div v-for="(feature, index) in features"
             :key="index"
             class="feature-card">
          <div class="feature-content">
            <div class="feature-header">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <h3 class="feature-title">{{ feature.title }}</h3>
            </div>
            <p class="feature-description">{{ feature.description }}</p>
            <router-link :to="feature.path"
                        class="feature-button">
              Explore
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
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

    onMounted(() => {
      if (!authStore.isLoggedIn) {
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

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #1a1a1a;
  color: #ffffff;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
}

.welcome-card {
  background: linear-gradient(135deg, #2c3e50, #1a1a1a);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.welcome-content {
  color: #ffffff;
}

.welcome-title {
  font-size: 1.8rem;
  margin-bottom: 1rem;
}

.user-greeting {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.welcome-message {
  opacity: 0.9;
}

.features-section {
  margin-top: 2rem;
}

.features-title {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #ffffff;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: #2c2c2c;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.feature-content {
  padding: 1.5rem;
}

.feature-header {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.feature-icon {
  background-color: #3498db;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
}

.feature-icon i {
  color: #ffffff;
  font-size: 24px;
}

.feature-title {
  font-size: 1.3rem;
  margin: 0;
  color: #ffffff;
}

.feature-description {
  color: #b3b3b3;
  margin-bottom: 1.5rem;
}

.feature-button {
  display: block;
  background-color: #3498db;
  color: #ffffff;
  text-decoration: none;
  padding: 0.8rem;
  border-radius: 6px;
  text-align: center;
  transition: background-color 0.2s ease;
}

.feature-button:hover {
  background-color: #2980b9;
}
</style>
