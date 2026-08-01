import { api } from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
      portal: 'guardian',
      role: 'guardian',
    })
    return response.data
  },

  async logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // Ignore errors on logout network failure
    } finally {
      localStorage.removeItem('token')
      localStorage.removeItem('guardian_user')
    }
  },

  async updateProfile(userId, data) {
    const response = await api.put(`/users/${userId}`, data)
    return response.data
  },
}
