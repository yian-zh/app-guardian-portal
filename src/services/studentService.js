import { api } from './api'

export const studentService = {
  async getStudents({ page = 1, perPage = 100 } = {}) {
    const response = await api.get('/students', { params: { page, per_page: perPage } })
    return response.data
  },

  async getChildStatus(studentId) {
    if (!studentId) return null
    const response = await api.get(`/operations/students/${studentId}/status`)
    return response.data
  },
}
