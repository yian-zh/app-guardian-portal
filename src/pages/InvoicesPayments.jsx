import { useState, useMemo, useCallback, useEffect } from 'react'
import { ChevronRight, Receipt, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useBillingLedger, usePayInvoice } from '@/hooks/useApi'

const TABS = [
  { key: 'unpaid', label: 'Unpaid Invoices' },
  { key: 'paid', label: 'Paid Invoices' },
]

const STATUS_TONE = {
  Unpaid: 'warning',
  Paid: 'success',
}

const PAYMENT_METHODS = ['Cash', 'Card', 'Bank Transfer']

function SummaryCard({ label, value, tone }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn('text-2xl font-bold', tone === 'success' && 'text-emerald-600', tone === 'warning' && 'text-amber-600')}>
        {value}
      </p>
    </div>
  )
}

function Modal({ open, onClose, title, children }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-foreground">{title}</h2>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}

function InvoiceDetailModal({ invoice, open, onClose, onPay }) {
  if (!invoice) return null
  return (
    <Modal open={open} onClose={onClose} title={`Invoice #${invoice.invoice_id}`}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Invoice Date</p>
            <p className="font-medium">{invoice.invoice_date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">{invoice.due_date}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="font-medium">${parseFloat(invoice.total_amount).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <StatusBadge label={invoice.status} tone={STATUS_TONE[invoice.status] || 'neutral'} />
          </div>
        </div>

        {invoice.payments && invoice.payments.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-foreground">Payment History</h3>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-1 pr-2 font-medium">Date</th>
                  <th className="py-1 pr-2 font-medium">Method</th>
                  <th className="py-1 pr-2 font-medium">Reference</th>
                  <th className="py-1 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payments.map((p) => (
                  <tr key={p.payment_id} className="border-b border-border/50">
                    <td className="py-2 pr-2">{new Date(p.payment_date).toLocaleDateString()}</td>
                    <td className="py-2 pr-2">{p.payment_method}</td>
                    <td className="py-2 pr-2 text-muted-foreground">{p.transaction_reference || '—'}</td>
                    <td className="py-2 text-right">${parseFloat(p.amount_paid).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {invoice.status === 'Unpaid' && (
          <div className="flex justify-end pt-2">
            <Button onClick={() => onPay(invoice)}>Pay Now</Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

function PaymentModal({ invoice, open, onClose, onSuccess }) {
  const { user } = useAuth()
  const guardianId = user?.guardian?.guardian_id || user?.user_id || user?.id
  const payMutation = usePayInvoice(guardianId)

  const [amount, setAmount] = useState('')
  const [method, setMethod] = useState(PAYMENT_METHODS[0])
  const [reference, setReference] = useState('')

  useEffect(() => {
    if (invoice) {
      const paidSoFar = invoice.payments?.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0) || 0
      const total = parseFloat(invoice.total_amount || 0)
      const remaining = Math.max(0, total - paidSoFar)
      setAmount(remaining > 0 ? remaining.toString() : (invoice.total_amount || ''))
      setMethod(PAYMENT_METHODS[0])
      setReference('')
    }
  }, [invoice])

  if (!invoice) return null

  const paidSoFar = invoice?.payments?.reduce((sum, p) => sum + parseFloat(p.amount_paid || 0), 0) || 0
  const total = parseFloat(invoice?.total_amount || 0)
  const remaining = Math.max(0, total - paidSoFar)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await payMutation.mutateAsync({
        invoice_id: invoice.invoice_id,
        amount_paid: parseFloat(amount),
        payment_method: method,
        ...(reference.trim() && { transaction_reference: reference.trim() }),
      })
      onSuccess()
    } catch {
      // error handled by mutation
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Pay Invoice #${invoice?.invoice_id}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <p className="font-medium">${total.toFixed(2)}</p>
        </div>
        {paidSoFar > 0 && (
          <div>
            <p className="text-sm text-muted-foreground">Already Paid</p>
            <p className="font-medium text-emerald-600">${paidSoFar.toFixed(2)}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-muted-foreground">Remaining</p>
          <p className="font-medium text-amber-600">${remaining.toFixed(2)}</p>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Amount to Pay</label>
          <Input
            type="number"
            step="0.01"
            min="0.01"
            max={remaining}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Transaction Reference (optional)</label>
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. TXN-001"
          />
        </div>

        {payMutation.isError && (
          <p className="text-sm text-red-600">{payMutation.error?.response?.data?.message || 'Payment failed. Please try again.'}</p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={payMutation.isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={payMutation.isPending}>
            {payMutation.isPending ? 'Processing…' : `Pay $${parseFloat(amount || 0).toFixed(2)}`}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export function InvoicesPayments() {
  const { user } = useAuth()
  const guardianId = user?.guardian?.guardian_id || user?.user_id || user?.id
  const { data: ledgerData, isLoading, isError } = useBillingLedger(guardianId)

  const [activeTab, setActiveTab] = useState(TABS[0].key)
  const [detailInvoice, setDetailInvoice] = useState(null)
  const [payInvoice, setPayInvoice] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  const invoices = useMemo(() => ledgerData?.invoices ?? [], [ledgerData])

  const filteredInvoices = useMemo(() => {
    if (activeTab === 'unpaid') return invoices.filter((inv) => inv.status === 'Unpaid')
    return invoices.filter((inv) => inv.status === 'Paid')
  }, [invoices, activeTab])

  const totalDue = ledgerData?.total_due ?? 0
  const totalPaid = ledgerData?.total_paid ?? 0

  const handlePayClick = useCallback((invoice) => {
    setDetailInvoice(null)
    setPayInvoice(invoice)
  }, [])

  const handlePaymentSuccess = useCallback(() => {
    setPayInvoice(null)
    setSuccessMessage('Payment recorded successfully.')
    setTimeout(() => setSuccessMessage(''), 4000)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Finance</span>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="font-medium text-primary">Billing &amp; Payments</span>
        </div>
        <h1 className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
          Billing &amp; Payments
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total Invoices" value={invoices.length} tone="info" />
        <SummaryCard label="Total Due" value={`$${parseFloat(totalDue).toFixed(2)}`} tone="warning" />
        <SummaryCard label="Total Paid" value={`$${parseFloat(totalPaid).toFixed(2)}`} tone="success" />
      </div>

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {successMessage}
        </div>
      )}

      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          Unable to load invoices. The billing service may not be available.
        </div>
      )}

      <div className="border-b border-border">
        <div className="flex gap-6">
          {TABS.map(({ key, label }) => {
            const count = invoices.filter((inv) =>
              key === 'unpaid' ? inv.status === 'Unpaid' : inv.status === 'Paid'
            ).length
            const isActive = activeTab === key
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={cn(
                  'flex items-center gap-2 border-b-2 pb-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {label}
                {count > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <SectionCard className="p-0">
        <div className="flex items-center justify-between p-6">
          <h2 className="text-lg font-bold text-foreground">Invoices</h2>
        </div>

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-y border-border bg-muted/40">
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-foreground">Invoice</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-foreground">Date</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-foreground">Due Date</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-foreground">Amount</th>
                  <th className="whitespace-nowrap px-6 py-3 text-sm font-semibold text-foreground">Status</th>
                  <th className="whitespace-nowrap px-6 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <tr key={inv.invoice_id} className="border-b border-border last:border-none">
                      <td className="px-6 py-4 font-medium text-foreground">#{inv.invoice_id}</td>
                      <td className="px-6 py-4 text-foreground">{inv.invoice_date}</td>
                      <td className="px-6 py-4 text-foreground">{inv.due_date}</td>
                      <td className="px-6 py-4 text-foreground">${parseFloat(inv.total_amount).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <StatusBadge label={inv.status} tone={STATUS_TONE[inv.status] || 'neutral'} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            type="button"
                            onClick={() => setDetailInvoice(inv)}
                            className="text-sm font-medium text-primary hover:underline"
                          >
                            View
                          </button>
                          {inv.status === 'Unpaid' && (
                            <Button size="sm" onClick={() => handlePayClick(inv)}>
                              Pay Now
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6}>
                      <EmptyState
                        icon={Receipt}
                        title={activeTab === 'unpaid' ? 'No unpaid invoices' : 'No paid invoices'}
                        description="Billing records will appear here once available."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </SectionCard>

      <InvoiceDetailModal
        invoice={detailInvoice}
        open={!!detailInvoice}
        onClose={() => setDetailInvoice(null)}
        onPay={handlePayClick}
      />

      <PaymentModal
        invoice={payInvoice}
        open={!!payInvoice}
        onClose={() => setPayInvoice(null)}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  )
}
