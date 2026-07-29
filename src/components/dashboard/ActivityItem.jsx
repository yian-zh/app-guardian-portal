import { LogIn, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const TYPE_ICONS = {
  boarded: LogIn,
  dropoff: LogOut,
}

export function ActivityItem({ type, title, description, timestamp, tone }) {
  const Icon = TYPE_ICONS[type] ?? LogIn
  const isSuccess = tone === 'success'

  return (
    <div className="flex gap-3 border-b border-border py-4 last:border-none last:pb-0">
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
          isSuccess ? 'bg-emerald-50 text-emerald-600' : 'bg-primary/10 text-primary'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-1 text-xs text-muted-foreground">{timestamp}</p>
      </div>
    </div>
  )
}
