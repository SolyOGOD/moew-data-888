import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null
  }),
  getters: {
    isAuthenticated: (state) => !!state.token
  },
  actions: {
    // Initialize auth state from local storage
    initialize() {
      const storedToken = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')
      if (storedToken && storedUser) {
        this.token = storedToken
        this.user = JSON.parse(storedUser)
        // Set Axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      }
    },
    // Login user
    async login(username, password) {
      this.loading = true
      this.error = null
      try {
        const response = await axios.post(`/auth/login`, { username, password })
        const { token, user } = response.data
        
        this.token = token
        this.user = user
        
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed. Please try again.'
        console.error('Login error:', err)
        return false
      } finally {
        this.loading = false
      }
    },
    // Register user
    async register(username, email, password) {
      this.loading = true
      this.error = null
      try {
        await axios.post(`/auth/register`, { username, email, password })
        return true
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed. Please try again.'
        console.error('Registration error:', err)
        return false
      } finally {
        this.loading = false
      }
    },
    // Logout user
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
    }
  }
})
