import { api } from './api'

export const billingService = {
  async getLedger(guardianId, { page = 1, perPage = 50, status } = {}) {
    if (!guardianId) return null
    const params = { page, per_page: perPage }
    if (status) params.status = status
    const response = await api.get(`/billing/guardians/${guardianId}/ledger`, { params })
    return response.data
  },

  async getInvoice(invoiceId) {
    const response = await api.get(`/billing/invoices/${invoiceId}`)
    return response.data
  },

  async payInvoice(payload) {
    const response = await api.post('/billing/payments', payload)
    return response.data
  },
}
