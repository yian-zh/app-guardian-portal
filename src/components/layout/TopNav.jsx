import { Menu, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { StudentSwitcher } from '@/components/common/StudentSwitcher'

export function TopNav({ onMenuClick }) {
  const { user } = useAuth()

  const displayName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || user.email
    : 'Guardian'

  const initials = user && (user.first_name || user.last_name)
    ? `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase()
    : null

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <StudentSwitcher />

      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold leading-none text-foreground">
            {displayName}
          </p>
          <p className="mt-1 text-xs text-muted-foreground font-medium capitalize">
            {user?.role || 'Guardian Account'}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {initials || <User className="h-5 w-5" />}
        </div>
      </div>
    </header>
  )
}
