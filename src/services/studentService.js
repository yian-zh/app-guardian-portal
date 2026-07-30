import { api } from './api'

async function fetchAllPages(fetchPageFn, perPage = 50) {
  const firstRes = await fetchPageFn(1, perPage)
  if (!firstRes) return []

  let items = Array.isArray(firstRes) ? firstRes : (firstRes.data || [])
  const lastPage = firstRes.last_page || firstRes.meta?.last_page || 1

  if (lastPage > 1) {
    const batchSize = 3
    for (let page = 2; page <= lastPage; page += batchSize) {
      const batchPromises = []
      for (let p = page; p < Math.min(page + batchSize, lastPage + 1); p++) {
        batchPromises.push(fetchPageFn(p, perPage))
      }
      const results = await Promise.all(batchPromises)
      for (const res of results) {
        const pageItems = Array.isArray(res) ? res : (res?.data || [])
        items = items.concat(pageItems)
      }
    }
  }

  return items
}

export const studentService = {
  async getStudents({ perPage = 50, guardianId } = {}) {
    const allStudents = await fetchAllPages(
      (page, pp) => {
        const params = { page, per_page: pp }
        if (guardianId) params.guardian_id = guardianId
        return api.get('/students', { params }).then((r) => r.data)
      },
      perPage
    )
    return { data: allStudents }
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
