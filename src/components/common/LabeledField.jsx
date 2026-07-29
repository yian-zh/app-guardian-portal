// A small uppercase label (with an optional leading icon) above a value line.
export function LabeledField({ icon: Icon, label, value }) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </p>
      <p className="mt-1 font-medium text-foreground">{value}</p>
    </div>
  )
}
