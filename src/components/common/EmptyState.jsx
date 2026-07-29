// Centered icon + message shown in place of a list/table body when
// there is no data yet (e.g. before the Laravel backend has records).
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      {Icon && <Icon className="h-8 w-8 text-muted-foreground/40" />}
      <p className="text-sm font-medium text-foreground">{title}</p>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
