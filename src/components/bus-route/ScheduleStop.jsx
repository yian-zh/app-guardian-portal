import { Clock } from 'lucide-react'

export function ScheduleStop({ icon: Icon, label, address, time }) {
  return (
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="font-semibold text-foreground">{address}</p>
        <p className="flex items-center gap-1.5 text-sm text-primary">
          <Clock className="h-3.5 w-3.5" />
          {time}
        </p>
      </div>
    </div>
  )
}
