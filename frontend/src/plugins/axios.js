import axios from 'axios'

const DEFAULT_API = 'http://localhost:5000/api'
const baseURL = import.meta.env.VITE_API_URL || DEFAULT_API

axios.defaults.baseURL = baseURL

// Optional: use JSON responses by default
axios.defaults.headers.common['Accept'] = 'application/json'

export default axios
