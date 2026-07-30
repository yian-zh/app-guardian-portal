import axios from 'axios'
import axiosRetry from 'axios-retry'

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api-final-albch.ondigitalocean.app/api'
const API_BASE_URL = rawBaseUrl.endsWith('/api') 
  ? rawBaseUrl 
  : `${rawBaseUrl.replace(/\/$/, '')}/api`


export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

axiosRetry(api, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED'
  },
})

// Attach Authorization Bearer token to every request if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Global response interceptor for handling 401 unauthenticated requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on auth failure
      localStorage.removeItem('token')
      localStorage.removeItem('guardian_user')
    }
    return Promise.reject(error)
  }
)
