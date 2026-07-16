<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-tr from-primary/10 via-base-100 to-secondary/15 px-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-200 backdrop-blur-md">
      <div class="card-body">
        <div class="text-center mb-6">
          <h2 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            Welcome Back
          </h2>
          <p class="text-sm text-base-content/60 mt-2">Log in to manage dog records</p>
        </div>

        <!-- Error Alert -->
        <div v-if="authStore.error" class="alert alert-error shadow-sm py-2 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span class="text-sm">{{ authStore.error }}</span>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control w-full">
            <label class="label">
              <span class="label-text font-semibold">Username</span>
            </label>
            <input 
              v-model="username" 
              type="text" 
              placeholder="admin" 
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

          <div class="form-control mt-6">
            <button 
              type="submit" 
              class="btn btn-primary w-full text-white shadow-lg bg-gradient-to-r from-primary to-secondary border-none hover:opacity-90"
              :disabled="authStore.loading"
            >
              <span v-if="authStore.loading" class="loading loading-spinner loading-sm"></span>
              Sign In
            </button>
          </div>
        </form>

        <div class="text-center mt-6 text-sm">
          <span class="text-base-content/60">Don't have an account? </span>
          <router-link to="/register" class="link link-primary font-semibold hover:underline">Sign up now</router-link>
        </div>

        <div class="divider text-xs text-base-content/40">OR</div>
        
        <div class="text-center">
          <router-link to="/" class="btn btn-outline btn-sm gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
            Continue as Guest
          </router-link>
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
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value)
  if (success) {
    router.push('/')
  }
}
</script>
