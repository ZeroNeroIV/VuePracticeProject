<template>
  <div class="app">
    <!-- App Bar -->
    <nav class="navbar">
      <h1 class="navbar-title">{{ title }}</h1>
      <div class="spacer"></div>
      <!-- Mobile menu button -->
      <button class="menu-toggle" @click="toggleDrawer">
        <i class="fas fa-bars"></i>
      </button>
      <!-- Desktop Navigation -->
      <div class="nav-links desktop-nav">
        <a href="/" class="nav-link">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </a>
        <a href="/dashboard" class="nav-link">
          <i class="fas fa-file-alt"></i>
          <span>Dashboard</span>
        </a>
        <a href="/fyp" class="nav-link">
          <i class="fas fa-th-large"></i>
          <span>For You</span>
        </a>
        <a href="/settings" class="nav-link">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
        <a v-if="authStore.isLoggedIn" @click="handleLogout" class="nav-link logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
        <a v-else href="/auth" class="nav-link">
          <i class="fas fa-sign-in-alt"></i>
          <span>Register/Login</span>
        </a>
      </div>
    </nav>

    <!-- Mobile Drawer -->
    <div class="drawer-overlay" :class="{ 'drawer-overlay-active': isMenuOpen }" @click="closeDrawer"></div>
    <div class="drawer" :class="{ 'drawer-open': isMenuOpen }">
      <div class="drawer-header">
        <h2>Menu</h2>
        <button class="drawer-close" @click="closeDrawer">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="drawer-content">
        <a href="/" class="nav-link" @click="closeDrawer">
          <i class="fas fa-home"></i>
          <span>Home</span>
        </a>
        <a href="/dashboard" class="nav-link" @click="closeDrawer">
          <i class="fas fa-file-alt"></i>
          <span>Dashboard</span>
        </a>
        <a href="/fyp" class="nav-link" @click="closeDrawer">
          <i class="fas fa-th-large"></i>
          <span>For You</span>
        </a>
        <a href="/settings" class="nav-link" @click="closeDrawer">
          <i class="fas fa-cog"></i>
          <span>Settings</span>
        </a>
        <a v-if="authStore.isLoggedIn" @click="handleLogoutAndClose" class="nav-link logout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </a>
        <a v-else href="/auth" class="nav-link" @click="closeDrawer">
          <i class="fas fa-sign-in-alt"></i>
          <span>Register/Login</span>
        </a>
      </div>
    </div>

    <!-- Main Content -->
    <main class="main-content">
      <router-view v-if="!isLoading" />
      <div v-else class="loading">Loading...</div>
    </main>
    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">&copy; 2025 Vue Practice App - Alameen Sabbah</div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from './config/router-setup'
import { title } from '@/main.ts'

title.value = 'Vue Practice Project'

const authStore = useAuthStore()
const isLoading = ref<boolean>(false)
const isMenuOpen = ref<boolean>(false)

const handleMounting = async (): Promise<void> => {
  isLoading.value = true
  authStore.initAuth().then(() => {
    isLoading.value = false
  })
}

const toggleDrawer = (): void => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}

const closeDrawer = (): void => {
  isMenuOpen.value = false
  document.body.style.overflow = 'auto'
}

const handleLogoutAndClose = async (): Promise<void> => {
  await handleLogout()
  closeDrawer()
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
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
}

.navbar {
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: transparent;
  position: relative;
  width: 100%;
  z-index: 100;
}

.navbar-title {
  font-size: clamp(1.2rem, 2vw, 1.5rem);
  margin: 0;
  white-space: nowrap;
}

.spacer {
  flex: 1;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.3s;
  white-space: nowrap;
  font-size: clamp(0.9rem, 1.5vw, 1rem);
}

.nav-link:hover {
  opacity: 0.8;
}

.nav-link.logout {
  color: #ff5252;
}

/* Drawer styles */
.drawer {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: #1a1a1a;
  transition: transform 0.3s ease-in-out;
  z-index: 1000;
}

.drawer-open {
  transform: translateX(-300px);
}

.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out;
  z-index: 999;
}

.drawer-overlay-active {
  opacity: 1;
  visibility: visible;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #333;
}

.drawer-header h2 {
  margin: 0;
  color: white;
}

.drawer-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
}

.drawer-content {
  display: flex;
  flex-direction: column;
  padding: 1rem;
}

.drawer-content .nav-link {
  padding: 1rem;
  border-radius: 4px;
}

.drawer-content .nav-link:hover {
  background-color: #333;
}

/* Responsive styles */
@media screen and (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .desktop-nav {
    display: none;
  }
}

@media screen and (min-width: 769px) {
  .drawer, .drawer-overlay {
    display: none;
  }
}

/* Main content and footer responsive styles */
.main-content {
  flex: 1;
  padding: 1rem;
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: auto;
}

.footer {
  background-color: #333;
  padding: 1rem;
  text-align: center;
  width: 100%;
}

.footer-content {
  color: white;
  font-size: clamp(0.8rem, 1.5vw, 1rem);
  padding: clamp(0.5rem, 1vw, 1rem);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: clamp(1rem, 2vw, 1.2rem);
}
</style>
