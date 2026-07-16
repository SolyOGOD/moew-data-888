<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary/10 via-base-100 to-secondary/15 px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200 backdrop-blur-md">
      <div class="card-body">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Create Account
          </h2>
          <p class="text-sm text-base-content/60 mt-2">Join us to start managing dog records</p>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="alert alert-success shadow-sm py-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-sm">{{ successMessage }}</span>
        </div>

        <!-- Error Alert -->
        <div v-if="authStore.error" class="alert alert-error shadow-sm py-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-sm">{{ authStore.error }}</span>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Username</span>
            </label>
            <input 
              v-model="username" 
              type="text" 
              placeholder="johndoe" 
              class="input input-bordered w-full focus:input-primary transition-all duration-200" 
              required
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Email Address</span>
            </label>
            <input 
              v-model="email" 
              type="email" 
              placeholder="john@example.com" 
              class="input input-bordered w-full focus:input-primary transition-all duration-200" 
              required
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Password</span>
            </label>
            <input 
              v-model="password" 
              type="password" 
              placeholder="••••••••" 
              class="input input-bordered w-full focus:input-primary transition-all duration-200" 
              required
            />
          </div>

          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Confirm Password</span>
            </label>
            <input 
              v-model="confirmPassword" 
              type="password" 
              placeholder="••••••••" 
              class="input input-bordered w-full focus:input-primary transition-all duration-200" 
              required
            />
          </div>

          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary w-full text-white shadow-lg bg-gradient-to-r from-primary to-secondary border-none hover:opacity-90"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
              Create Account
            </button>
          </div>
        </form>

        <div class="text-center mt-6 text-sm">
          <span class="text-base-content/60">Already have an account? </span>
          <router-link to="/login" class="link link-primary font-semibold hover:underline">Sign In</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const successMessage = ref('')

const authStore = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.error = 'Passwords do not match.'
    return
  }
  
  const success = await authStore.register(username.value, email.value, password.value)
  if (success) {
    successMessage.value = 'Registration successful! Redirecting to login...'
    authStore.error = null
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}
</script>
