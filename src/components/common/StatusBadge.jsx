import { cn } from '@/lib/utils'

const TONE_STYLES = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-600',
  neutral: 'bg-muted text-muted-foreground',
}

const DOT_STYLES = {
  success: 'bg-emerald-600',
  warning: 'bg-amber-600',
  danger: 'bg-red-600',
  info: 'bg-blue-600',
  neutral: 'bg-muted-foreground',
}

// Small colored dot + label pill used for row statuses across the
// Attendance History and Invoices & Payments tables.
export function StatusBadge({ label, tone = 'neutral' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        TONE_STYLES[tone]
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', DOT_STYLES[tone])} />
      {label}
    </span>
  )
}
