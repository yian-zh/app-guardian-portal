// Local placeholder data for the Invoices & Payments page, standing in
// for the Laravel API response until billing records exist.
export const invoiceTabs = [
  { key: 'active', label: 'Active Invoices' },
  { key: 'history', label: 'Payment History' },
  { key: 'scheduled', label: 'Scheduled' },
]

// Each invoice is expected to look like:
// { id, description, amount, dueDate, status, tone }
// Empty until billing records are available from the backend.
export const invoicesByTab = {
  active: [],
  history: [],
  scheduled: [],
}
