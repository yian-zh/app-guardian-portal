import { api } from './api'

export const routeService = {
  async getRoutes({ page = 1, perPage = 100, studentId } = {}) {
    const params = { page, per_page: perPage }
    if (studentId) params.student_id = studentId
    const response = await api.get('/routes', { params })
    return response.data
  },

  async getBuses({ page = 1, perPage = 100 } = {}) {
    const response = await api.get('/buses', { params: { page, per_page: perPage } })
    return response.data
  },

  async getRouteManifest(routeId, { page = 1, perPage = 200 } = {}) {
    if (!routeId) return { data: [] }
    const response = await api.get(`/operations/routes/${routeId}/manifest`, {
      params: { page, per_page: perPage },
    })
    return response.data
  },
}
