export function InfoTile({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-lg bg-muted/60 p-4">
      <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <p className="mt-1 font-semibold text-foreground">{value}</p>
      {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
    </div>
  )
}
