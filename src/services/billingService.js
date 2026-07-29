import { api } from './api'

export const billingService = {
  async getLedger(guardianId) {
    if (!guardianId) return null
    const response = await api.get(`/billing/guardians/${guardianId}/ledger`)
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
