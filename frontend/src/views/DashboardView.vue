<template>
  <div class="min-h-screen bg-base-200">
    <!-- Navbar -->
    <header class="navbar bg-base-100 shadow-md px-6 border-b border-base-300 sticky top-0 z-40">
      <div class="flex-1">
        <a class="flex items-center gap-2 font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          🐕 DogRegistry
        </a>
      </div>
      <div class="flex-none gap-4">
        <!-- Auth actions -->
        <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
          <span class="text-sm font-semibold opacity-75">
            Hello, <span class="text-primary font-bold">{{ authStore.user?.username }}</span>
          </span>
          <button @click="handleLogout" class="btn btn-outline btn-error btn-sm">
            Logout
          </button>
        </div>
        <div v-else class="flex gap-2">
          <router-link to="/login" class="btn btn-ghost btn-sm">Sign In</router-link>
          <router-link to="/register" class="btn btn-primary btn-sm text-white bg-gradient-to-r from-primary to-secondary border-none">Sign Up</router-link>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-6 space-y-6">
      <!-- Alerts -->
      <div v-if="successMsg" class="alert alert-success shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ successMsg }}</span>
      </div>
      <div v-if="errorMsg" class="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="stat bg-base-100 rounded-2xl shadow border border-base-300">
          <div class="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Total Dogs</div>
          <div class="stat-value text-3xl font-extrabold text-primary">{{ stats.total }}</div>
        </div>
        <div class="stat bg-base-100 rounded-2xl shadow border border-base-300">
          <div class="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Active</div>
          <div class="stat-value text-3xl font-extrabold text-success">{{ stats.active }}</div>
        </div>
        <div class="stat bg-base-100 rounded-2xl shadow border border-base-300">
          <div class="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Adopted</div>
          <div class="stat-value text-3xl font-extrabold text-info">{{ stats.adopted }}</div>
        </div>
        <div class="stat bg-base-100 rounded-2xl shadow border border-base-300">
          <div class="stat-title text-xs font-bold uppercase tracking-wider opacity-60">Missing</div>
          <div class="stat-value text-3xl font-extrabold text-error">{{ stats.missing }}</div>
        </div>
      </div>

      <!-- Filters & Toolbar -->
      <div class="bg-base-100 rounded-2xl p-6 shadow-md border border-base-300 space-y-4">
        <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <h2 class="text-xl font-bold flex items-center gap-2">
            🔍 Filter Dashboard
          </h2>
          <!-- Add Button (Protected) -->
          <button 
            v-if="authStore.isAuthenticated" 
            @click="openAddModal" 
            class="btn btn-primary btn-md w-full lg:w-auto text-white shadow-lg bg-gradient-to-r from-primary to-secondary border-none hover:opacity-90"
          >
            ➕ Add New Dog
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <!-- Search Name -->
          <input 
            v-model="filters.name" 
            @input="fetchDogs" 
            type="text" 
            placeholder="Search by name..." 
            class="input input-bordered w-full"
          />

          <!-- Gender -->
          <select v-model="filters.gender" @change="fetchDogs" class="select select-bordered w-full">
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <!-- Status -->
          <select v-model="filters.status" @change="fetchDogs" class="select select-bordered w-full">
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Adopted">Adopted</option>
            <option value="Missing">Missing</option>
          </select>

          <!-- Breed -->
          <input 
            v-model="filters.breed" 
            @input="fetchDogs" 
            type="text" 
            placeholder="Breed..." 
            class="input input-bordered w-full"
          />

          <!-- Color -->
          <input 
            v-model="filters.color" 
            @input="fetchDogs" 
            type="text" 
            placeholder="Color..." 
            class="input input-bordered w-full"
          />
        </div>

        <div class="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-base-200">
          <!-- Sorting options -->
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold opacity-70">Sort By:</span>
            <select v-model="filters.sortBy" @change="fetchDogs" class="select select-ghost select-xs font-bold">
              <option value="created_at">Date Created</option>
              <option value="name">Name</option>
              <option value="age">Age</option>
              <option value="breed">Breed</option>
              <option value="status">Status</option>
            </select>
            <select v-model="filters.order" @change="fetchDogs" class="select select-ghost select-xs font-bold">
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>
          </div>

          <!-- View toggler -->
          <div class="join bg-base-200 p-0.5 rounded-lg border border-base-300">
            <button 
              @click="viewMode = 'card'" 
              class="btn btn-xs join-item" 
              :class="viewMode === 'card' ? 'btn-active btn-neutral' : 'btn-ghost'"
            >
              Cards
            </button>
            <button 
              @click="viewMode = 'table'" 
              class="btn btn-xs join-item" 
              :class="viewMode === 'table' ? 'btn-active btn-neutral' : 'btn-ghost'"
            >
              Table
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center py-20 gap-4">
        <span class="loading loading-infinity loading-lg text-primary"></span>
        <span class="text-sm font-semibold opacity-60">Retrieving dog registry records...</span>
      </div>

      <!-- Empty State -->
      <div v-else-if="dogs.length === 0" class="card bg-base-100 shadow border border-base-300 py-16 text-center">
        <div class="card-body items-center">
          <span class="text-6xl">🦮</span>
          <h3 class="text-xl font-bold mt-4">No dog records found</h3>
          <p class="text-sm opacity-60 max-w-sm">Try widening your search terms or filters above, or create a new entry.</p>
        </div>
      </div>

      <!-- Main Display Layouts -->
      <div v-else>
        <!-- Card Grid Layout -->
        <div v-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div 
            v-for="dog in dogs" 
            :key="dog.id" 
            class="card bg-base-100 shadow-lg border border-base-200 hover:-translate-y-1 transition-all duration-300"
          >
            <!-- Dog image with status badge -->
            <figure class="relative h-48 bg-base-300 overflow-hidden">
              <img 
                :src="dog.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=600'" 
                :alt="dog.name" 
                class="w-full h-full object-cover"
              />
              <span 
                class="absolute top-4 right-4 badge font-bold text-xs uppercase shadow-md px-3 py-2"
                :class="{
                  'badge-success text-white': dog.status === 'Active',
                  'badge-info text-white': dog.status === 'Adopted',
                  'badge-error text-white': dog.status === 'Missing'
                }"
              >
                {{ dog.status }}
              </span>
            </figure>

            <div class="card-body">
              <div class="flex items-center justify-between">
                <h3 class="card-title text-xl font-black">{{ dog.name }}</h3>
                <span 
                  class="badge text-xs font-semibold"
                  :class="dog.gender === 'Male' ? 'badge-primary text-white' : 'badge-secondary text-white'"
                >
                  {{ dog.gender }}
                </span>
              </div>

              <div class="space-y-1.5 mt-3 text-sm opacity-80">
                <p><strong>Breed:</strong> {{ dog.breed || 'Unknown' }}</p>
                <p><strong>Age:</strong> {{ dog.age ? `${dog.age} Months` : 'Unknown' }}</p>
                <p><strong>Color:</strong> {{ dog.color || 'Unknown' }}</p>
                <p class="truncate"><strong>Location:</strong> {{ dog.address || 'Unknown' }}</p>
              </div>

              <!-- Protected Actions -->
              <div v-if="authStore.isAuthenticated" class="card-actions justify-end mt-6 pt-4 border-t border-base-200 gap-2">
                <button @click="openEditModal(dog)" class="btn btn-outline btn-warning btn-sm">Edit</button>
                <button @click="handleDelete(dog.id)" class="btn btn-outline btn-error btn-sm">Delete</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Table List Layout -->
        <div v-else-if="viewMode === 'table'" class="overflow-x-auto bg-base-100 rounded-2xl shadow border border-base-300">
          <table class="table w-full">
            <thead>
              <tr class="bg-base-200">
                <th>Name</th>
                <th>Gender</th>
                <th>Breed</th>
                <th>Age (Months)</th>
                <th>Color</th>
                <th>Location</th>
                <th>Status</th>
                <th v-if="authStore.isAuthenticated" class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dog in dogs" :key="dog.id" class="hover">
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar">
                      <div class="mask mask-squircle w-10 h-10">
                        <img :src="dog.image_url || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=100'" :alt="dog.name" />
                      </div>
                    </div>
                    <div>
                      <div class="font-bold">{{ dog.name }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span 
                    class="badge badge-sm font-semibold"
                    :class="dog.gender === 'Male' ? 'badge-primary text-white' : 'badge-secondary text-white'"
                  >
                    {{ dog.gender }}
                  </span>
                </td>
                <td>{{ dog.breed || '-' }}</td>
                <td>{{ dog.age || '-' }}</td>
                <td>{{ dog.color || '-' }}</td>
                <td class="max-w-xs truncate">{{ dog.address || '-' }}</td>
                <td>
                  <span 
                    class="badge badge-sm font-bold text-xs uppercase"
                    :class="{
                      'badge-success text-white': dog.status === 'Active',
                      'badge-info text-white': dog.status === 'Adopted',
                      'badge-error text-white': dog.status === 'Missing'
                    }"
                  >
                    {{ dog.status }}
                  </span>
                </td>
                <td v-if="authStore.isAuthenticated" class="text-right">
                  <div class="flex justify-end gap-2">
                    <button @click="openEditModal(dog)" class="btn btn-warning btn-xs">Edit</button>
                    <button @click="handleDelete(dog.id)" class="btn btn-error btn-xs text-white">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>

    <!-- Add/Edit Modal (Protected) -->
    <dialog ref="dogModal" class="modal">
      <div class="modal-box max-w-lg bg-base-100 border border-base-200">
        <h3 class="font-black text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {{ isEditing ? '✏️ Edit Dog Record' : '🐕 Add New Dog' }}
        </h3>
        
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Name *</span></label>
              <input v-model="formData.name" type="text" placeholder="Buddy" class="input input-bordered w-full" required />
            </div>
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Gender *</span></label>
              <select v-model="formData.gender" class="select select-bordered w-full" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Age (Months)</span></label>
              <input v-model.number="formData.age" type="number" min="0" placeholder="12" class="input input-bordered w-full" />
            </div>
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Status</span></label>
              <select v-model="formData.status" class="select select-bordered w-full">
                <option value="Active">Active</option>
                <option value="Adopted">Adopted</option>
                <option value="Missing">Missing</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Breed</span></label>
              <input v-model="formData.breed" type="text" placeholder="Chihuahua" class="input input-bordered w-full" />
            </div>
            <div class="form-control w-full">
              <label class="label"><span class="label-text font-semibold">Color</span></label>
              <input v-model="formData.color" type="text" placeholder="Brown/White" class="input input-bordered w-full" />
            </div>
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold">Image URL</span></label>
            <input v-model="formData.image_url" type="url" placeholder="https://..." class="input input-bordered w-full" />
          </div>

          <div class="form-control w-full">
            <label class="label"><span class="label-text font-semibold">Address / Location</span></label>
            <textarea v-model="formData.address" placeholder="Shelter Block A, BKK" class="textarea textarea-bordered w-full h-20"></textarea>
          </div>

          <div class="modal-action flex justify-end gap-3 mt-8">
            <button type="button" @click="closeModal" class="btn btn-ghost">Cancel</button>
            <button type="submit" class="btn btn-primary text-white bg-gradient-to-r from-primary to-secondary border-none">
              {{ isEditing ? 'Save Changes' : 'Create Entry' }}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const authStore = useAuthStore()
const dogs = ref([])
const loading = ref(false)
const viewMode = ref('card')
const dogModal = ref(null)

const successMsg = ref('')
const errorMsg = ref('')

const stats = reactive({
  total: 0,
  active: 0,
  adopted: 0,
  missing: 0
})

const filters = reactive({
  name: '',
  gender: '',
  status: '',
  breed: '',
  color: '',
  sortBy: 'created_at',
  order: 'DESC'
})

const isEditing = ref(false)
const selectedDogId = ref(null)
const formData = reactive({
  name: '',
  gender: 'Male',
  age: null,
  status: 'Active',
  breed: '',
  color: '',
  image_url: '',
  address: ''
})

const fetchDogs = async () => {
  loading.value = true
  try {
    const params = {}
    if (filters.name) params.name = filters.name
    if (filters.gender) params.gender = filters.gender
    if (filters.status) params.status = filters.status
    if (filters.breed) params.breed = filters.breed
    if (filters.color) params.color = filters.color
    params.sortBy = filters.sortBy
    params.order = filters.order

    const response = await axios.get(`${API_URL}/dogs`, { params })
    dogs.value = response.data
    calculateStats()
  } catch (err) {
    console.error('Error loading dogs data:', err)
    showNotification('error', 'Failed to retrieve dog records.')
  } finally {
    loading.value = false
  }
}

const calculateStats = () => {
  stats.total = dogs.value.length
  stats.active = dogs.value.filter(d => d.status === 'Active').length
  stats.adopted = dogs.value.filter(d => d.status === 'Adopted').length
  stats.missing = dogs.value.filter(d => d.status === 'Missing').length
}

const showNotification = (type, message) => {
  if (type === 'success') {
    successMsg.value = message
    setTimeout(() => successMsg.value = '', 4000)
  } else {
    errorMsg.value = message
    setTimeout(() => errorMsg.value = '', 4000)
  }
}

const handleLogout = () => {
  authStore.logout()
  fetchDogs() // refresh data to clear actions or reload list
  showNotification('success', 'You have been logged out.')
}

const openAddModal = () => {
  isEditing.value = false
  selectedDogId.value = null
  resetForm()
  dogModal.value.showModal()
}

const openEditModal = (dog) => {
  isEditing.value = true
  selectedDogId.value = dog.id
  formData.name = dog.name
  formData.gender = dog.gender
  formData.age = dog.age
  formData.status = dog.status
  formData.breed = dog.breed || ''
  formData.color = dog.color || ''
  formData.image_url = dog.image_url || ''
  formData.address = dog.address || ''
  dogModal.value.showModal()
}

const closeModal = () => {
  dogModal.value.close()
}

const resetForm = () => {
  formData.name = ''
  formData.gender = 'Male'
  formData.age = null
  formData.status = 'Active'
  formData.breed = ''
  formData.color = ''
  formData.image_url = ''
  formData.address = ''
}

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await axios.put(`${API_URL}/dogs/${selectedDogId.value}`, formData)
      showNotification('success', 'Dog record updated successfully.')
    } else {
      await axios.post(`${API_URL}/dogs`, formData)
      showNotification('success', 'Dog record added successfully.')
    }
    closeModal()
    fetchDogs()
  } catch (err) {
    console.error('Error submitting dog form:', err)
    showNotification('error', err.response?.data?.message || 'Action failed.')
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this dog record?')) return
  try {
    await axios.delete(`${API_URL}/dogs/${id}`)
    showNotification('success', 'Dog record deleted successfully.')
    fetchDogs()
  } catch (err) {
    console.error('Error deleting dog record:', err)
    showNotification('error', 'Failed to delete record.')
  }
}

onMounted(() => {
  fetchDogs()
})
</script>

<style scoped>
.modal::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}
</style>
