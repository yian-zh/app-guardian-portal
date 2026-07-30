import { api } from './api'

export const studentService = {
  async getStudents({ guardianId } = {}) {
    const params = { per_page: 'all' }
    if (guardianId) params.guardian_id = guardianId
    const response = await api.get('/students', { params })
    return response.data
  },

  async getChildStatus(studentId) {
    if (!studentId) return null
    const response = await api.get(`/operations/students/${studentId}/status`)
    return response.data
  },

  async getAttendanceHistory(studentId, { page = 1, perPage = 50, filter } = {}) {
    if (!studentId) return { data: [], last_page: 1 }
    const params = { page, per_page: perPage }
    if (filter) params.filter = filter
    const response = await api.get(`/operations/students/${studentId}/attendance`, { params })
    return response.data
  },
}
