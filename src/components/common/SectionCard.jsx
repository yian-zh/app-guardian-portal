import { cn } from '@/lib/utils'

// The flat, bordered white card used for every content section across
// the app's pages (Dashboard, My Child, etc). Kept distinct from the
// shadcn `Card` primitive (components/ui/card.jsx), which defaults to a
// drop shadow and a header/content split this app's design doesn't use.
export function SectionCard({ tone = 'default', className, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border p-6',
        tone === 'destructive'
          ? 'border-destructive/30 bg-destructive/5'
          : 'border-border bg-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
