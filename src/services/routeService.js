import { api } from './api'

export const routeService = {
  async getRoutes({ studentId } = {}) {
    const params = { per_page: 'all' }
    if (studentId) params.student_id = studentId
    const response = await api.get('/routes', { params })
    return response.data
  },

  async getBuses() {
    const response = await api.get('/buses', { params: { per_page: 1 } })
    return response.data
  },

  async getRouteManifest(routeId) {
    if (!routeId) return { data: [] }
    const response = await api.get(`/operations/routes/${routeId}/manifest`, {
      params: { per_page: 'all' },
    })
    return response.data
  },
}

