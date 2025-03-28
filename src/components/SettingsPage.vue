<template>
  <div class="settings-container">
    <h1>Settings</h1>
    <div class="settings-section">
      <h2>User Preferences</h2>
      <div class="setting-item">
        <label>Dark Mode</label>
        <input type="checkbox" v-model="darkMode">
      </div>
      <div class="setting-item">
        <label>Notifications</label>
        <input type="checkbox" v-model="notifications">
      </div>
      <div class="setting-item">
        <label>Language</label>
        <select v-model="language">
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
        </select>
      </div>
    </div>
    <button @click="saveSettings" class="save-button">Save Changes</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const darkMode = ref(true) // Set dark mode to true by default
const notifications = ref(true)
const language = ref('en')

onMounted(() => {
  document.body.classList.add('dark-theme')
})

const saveSettings = () => {
  // Here you would typically save settings to your backend or localStorage
  console.log('Settings saved:', {
    darkMode: darkMode.value,
    notifications: notifications.value,
    language: language.value
  })
}
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  color: #ffffff;
}

.settings-section {
  background: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  margin: 20px 0;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  padding: 10px 0;
  border-bottom: 1px solid #444;
}

.save-button {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:hover {
  background: #45a049;
}

/* Dark theme specific styles */
select {
  background: #333;
  color: white;
  border: 1px solid #444;
  padding: 5px;
  border-radius: 4px;
}

input[type="checkbox"] {
  accent-color: #4CAF50;
}

h1, h2, label {
  color: #ffffff;
}
</style>
