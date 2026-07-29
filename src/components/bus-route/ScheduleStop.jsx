import { Clock } from 'lucide-react'

export function ScheduleStop({ icon: Icon, label, title, address, location, time, estimatedTime, note }) {
  const displayLabel = label || title
  const displayAddress = address || location
  const displayTime = time || estimatedTime

  return (
    <div className="flex gap-3.5 items-start">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {Icon && <Icon className="h-5 w-5" />}
      </span>
      <div className="flex-1 min-w-0">
        {displayLabel && (
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            {displayLabel}
          </p>
        )}
        <p className="font-semibold text-foreground text-sm leading-snug mt-0.5">{displayAddress}</p>
        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
          {displayTime && (
            <p className="flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
              <Clock className="h-3.5 w-3.5" />
              {displayTime}
            </p>
          )}
          {note && <span className="text-xs text-muted-foreground font-medium">{note}</span>}
        </div>
      </div>
    </div>
  )
}
