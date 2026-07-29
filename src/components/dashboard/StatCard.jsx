import { CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export function StatCard({ icon: Icon, label, title, footnote, badge, tone }) {
  const isSuccess = tone === 'success'
  const isDanger = tone === 'danger'
  const isWarning = tone === 'warning'

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border bg-card p-5 shadow-sm transition-colors duration-300',
        isSuccess
          ? 'border-emerald-300 bg-emerald-50/40 dark:border-emerald-800 dark:bg-emerald-950/20'
          : isDanger
          ? 'border-red-300 bg-red-50/40 dark:border-red-800 dark:bg-red-950/20'
          : isWarning
          ? 'border-amber-300 bg-amber-50/40 dark:border-amber-800 dark:bg-amber-950/20'
          : 'border-border'
      )}
    >
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-300',
            isSuccess
              ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'
              : isDanger
              ? 'bg-red-100 text-red-600'
              : isWarning
              ? 'bg-amber-100 text-amber-600'
              : 'bg-primary/10 text-primary'
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {badge && (
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
              isSuccess
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
                : 'bg-emerald-50 text-emerald-600'
            )}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={cn(
            'mt-1 text-base font-semibold transition-colors duration-300',
            isSuccess
              ? 'text-emerald-700 dark:text-emerald-400'
              : isDanger
              ? 'text-red-700 dark:text-red-400'
              : isWarning
              ? 'text-amber-700 dark:text-amber-400'
              : 'text-foreground'
          )}
        >
          {title}
        </p>
      </div>

      {footnote && (
        <p
          className={cn(
            'flex items-center gap-1.5 text-sm font-medium',
            isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
          )}
        >
          {isSuccess && <CheckCircle2 className="h-4 w-4" />}
          {footnote}
        </p>
      )}
    </div>
  )
}
