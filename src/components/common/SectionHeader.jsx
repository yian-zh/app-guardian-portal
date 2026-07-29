// Icon badge + title used at the top of a SectionCard, with an optional
// action element (link/button) aligned to the right.
export function SectionHeader({ icon: Icon, title, action }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
      </div>
      {action}
    </div>
  )
}
