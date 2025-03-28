<template>
  <div class="container">
    <div class="row">
      <div class="card">
        <div class="card-header">
          <h1 class="title">Welcome to Vue Practice Project!</h1>
          <h2 class="subtitle">Learn Vue.js with TypeScript, Router, Pinia, and Vuetify</h2>
        </div>

        <div class="card-body">
          <div class="content">
            <p class="description">
              This application demonstrates the core concepts of Vue.js including:
            </p>
            <ul class="feature-list">
              <li v-for="(item, i) in features" :key="i" class="feature-item">
                <span class="check-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>
                <span class="feature-text">{{ item }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="card-footer">
          <button class="try-now-btn" @click="navigateToAuth">
            <span class="btn-text">Try Now</span>
            <span class="btn-icon">→</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { title } from '@/main.ts'
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  name: 'HomePage',
  setup() {
    title.value = 'Home'

    const router = useRouter()

    const features = ref([
      'TypeScript integration for type safety',
      'Vue Router for navigation',
      'Pinia for state management',
      'Component composition with the Composition API',
    ])

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

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #121212;
}

.row {
  width: 100%;
  max-width: 800px;
}

.card {
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  padding: 24px;
}

.card-header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  color: #64b5f6;
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.subtitle {
  color: #b0bec5;
  font-size: 1.25rem;
  margin-bottom: 24px;
}

.card-body {
  margin-bottom: 24px;
}

.description {
  margin-bottom: 16px;
  color: #e0e0e0;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  color: #e0e0e0;
  background: rgba(76, 175, 80, 0.1);
  padding: 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.feature-item:hover {
  background: rgba(76, 175, 80, 0.2);
  transform: translateX(5px);
}

.check-icon {
  margin-right: 12px;
  display: flex;
  align-items: center;
}

.feature-text {
  font-size: 1.1rem;
}

.try-now-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: linear-gradient(135deg, #64b5f6 0%, #1976d2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 200px;
  margin: 0 auto;
}

.try-now-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(100, 181, 246, 0.3);
  background: linear-gradient(135deg, #1976d2 0%, #64b5f6 100%);
}

.try-now-btn:active {
  transform: translateY(1px);
}

.btn-text {
  letter-spacing: 0.5px;
}

.btn-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.try-now-btn:hover .btn-icon {
  transform: translateX(5px);
}

.main-content {
  flex: 1;
  margin: 0;
  padding: 0 1rem;
  overflow: hidden;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.footer {
  background-color: #012121;
  padding: 1rem;
}

.footer-content {
  text-align: center;
  color: white;
  font-size: 0.9rem;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background-color: #1a1a1a;
    padding: 1rem;
    z-index: 1000;
  }

  .nav-links-open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: 0.7erem 1rem;
  }

  .navbar {
    padding: 1rem;
  }

  .try-now-btn {
    font-size: 1rem;
    padding: 10px 24px;
  }
}

@media screen and (max-width: 480px) {
  .navbar-title {
    font-size: 1.0rem;
  }

  .footer-content {
    font-size: 0.8rem;
  }

  .try-now-btn {
    max-width: 160px;
    font-size: 0.9rem;
    padding: 8px 20px;
  }
}
</style>