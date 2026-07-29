import { Mail, Phone, User } from 'lucide-react'

export function GuardianContactRow({ name, relation, phone, email }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/60 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{relation}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`tel:${phone}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label={`Call ${name}`}
        >
          <Phone className="h-4 w-4" />
        </a>
        <a
          href={`mailto:${email}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          aria-label={`Email ${name}`}
        >
          <Mail className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
