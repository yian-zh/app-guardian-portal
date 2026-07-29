// A bordered pill container used for small inline info readouts
// (e.g. an icon + date). Icon color/content is left to the caller
// since it varies slightly by page.
export function InfoPill({ children }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground">
      {children}
    </div>
  )
}
