import { Bell, Trash2 } from 'lucide-react'
import { SectionCard } from '@/components/common/SectionCard'
import { EmptyState } from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'
import { notifications } from '@/data/notifications'

const TONE_BORDER = {
  info: 'border-l-blue-500',
  neutral: 'border-l-muted-foreground/30',
  danger: 'border-l-destructive',
}

const TONE_ICON = {
  info: 'bg-primary/10 text-primary',
  neutral: 'bg-muted text-muted-foreground',
  danger: 'bg-destructive/10 text-destructive',
}

export function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            Notifications
          </h1>
          <p className="mt-1 text-muted-foreground">
            Stay updated with your child&apos;s transit and school alerts.
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-destructive hover:underline"
          >
            <Trash2 className="h-4 w-4" />
            Delete all
          </button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="space-y-4">
          {notifications.map((notification, index) => (
            <div
              key={index}
              className={cn(
                'flex gap-4 rounded-xl border border-border bg-card p-5 border-l-4',
                TONE_BORDER[notification.tone] ?? TONE_BORDER.neutral
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  TONE_ICON[notification.tone] ?? TONE_ICON.neutral
                )}
              >
                <Bell className="h-4 w-4" />
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-foreground">{notification.title}</p>
                  <p className="whitespace-nowrap text-xs text-muted-foreground">
                    {notification.timestamp}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {notification.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <SectionCard>
          <EmptyState
            icon={Bell}
            title="No notifications available"
            description="You'll see transit and school alerts here as they happen."
          />
        </SectionCard>
      )}
    </div>
  )
}
