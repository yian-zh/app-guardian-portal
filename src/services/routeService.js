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

export const routeService = {
  async getRoutes({ perPage = 50, studentId } = {}) {
    const allRoutes = await fetchAllPages(
      (page, pp) => {
        const params = { page, per_page: pp }
        if (studentId) params.student_id = studentId
        return api.get('/routes', { params }).then((r) => r.data)
      },
      perPage
    )
    return { data: allRoutes }
  },

  async getBuses({ perPage = 50 } = {}) {
    const allBuses = await fetchAllPages(
      (page, pp) => api.get('/buses', { params: { page, per_page: pp } }).then((r) => r.data),
      perPage
    )
    return { data: allBuses }
  },

  async getRouteManifest(routeId, { perPage = 50 } = {}) {
    if (!routeId) return { data: [] }
    const allStops = await fetchAllPages(
      (page, pp) => api.get(`/operations/routes/${routeId}/manifest`, { params: { page, per_page: pp } }).then((r) => r.data),
      perPage
    )
    return { data: allStops }
  },
}

