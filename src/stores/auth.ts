import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
  email: string
}

export interface AuthCredentials {
  name?: string
  email?: string
  identifier?: string
  password: string
}

export const useAuthStore = defineStore('auth', () => {
  const URL = 'http://localhost:3001/'
  const REGISTER = 'register'
  const LOGIN = 'login'
  const LOGOUT = 'logout'
  const REFRESH = 'refresh'

  const user = ref<User | null>(null)
  const isLoggedIn = ref<boolean>(false)
  const authError = ref<string | null>(null)
  const isLoading = ref<boolean>(false)
  const isInitialized = ref<boolean>(true)

  const initAuth = async (): Promise<void> => {
    const accessToken = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')

    if (accessToken && storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        isLoggedIn.value = true
      } catch (e) {
        localStorage.clear()
        isLoggedIn.value = false
      }
    }
    isInitialized.value = false
  }

  const login = async (credentials: AuthCredentials): Promise<boolean> => {
    try {
      isLoading.value = true
      authError.value = null
      const response = await fetch(URL + LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        authError.value = 'Invalid credentials'
        return false
      }

      const { user: loggedUser, accessToken } = await response.json()

      user.value = loggedUser
      isLoggedIn.value = true
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(loggedUser))

      return true
    } catch (error) {
      authError.value = 'Log In Failed: Invalid email or password'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const response = await fetch(URL + REFRESH, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in the request
      })

      if (!response.ok) throw new Error('Failed to refresh token')

      const { accessToken } = await response.json()
      localStorage.setItem('accessToken', accessToken)

      return true
    } catch (error) {
      logout()
      return false
    }
  }

  const register = async (credentials: AuthCredentials): Promise<boolean> => {
    try {
      isLoading.value = true
      authError.value = null

      const response = await fetch(URL + REGISTER, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (response.status === 409) {
        authError.value = 'Email already exists'
        return false
      }

      if (!response.ok) throw new Error('Registration failed')

      const { user: loggedUser } = await response.json()

      user.value = loggedUser
      isLoggedIn.value = true
      localStorage.setItem('user', JSON.stringify(loggedUser))
      return true
    } catch (error) {
      authError.value = 'Registration Failed: Invalid email or password\n\n' + error
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken') // Retrieve the access token

      if (!accessToken) {
        console.error('No access token found for logout')
        authError.value = 'No access token found'
        isLoggedIn.value = false
        return
      }

      const response = await fetch(URL + LOGOUT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to log out')
      }

      // Clear user data and redirect
      user.value = null
      isLoggedIn.value = false
      localStorage.clear()
    } catch (error) {
      user.value = null
      isLoggedIn.value = false
      localStorage.clear()
      console.error('Logout failed:', error)
      authError.value = 'An error occurred while logging out'
    }
  }

  initAuth()

  return {
    user,
    isLoggedIn,
    authError,
    isLoading,
    login,
    register,
    logout,
    initAuth,
    isInitialized,
    refreshAccessToken,
  }
})
