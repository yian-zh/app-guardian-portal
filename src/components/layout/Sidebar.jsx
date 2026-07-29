import { NavLink, useNavigate } from 'react-router-dom'
import { Bus, LogOut, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { navItems } from '@/data/navigation'
import { ROUTES } from '@/routes/paths'
import { useAuth } from '@/context/AuthContext'

export function Sidebar({ open, onClose }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    onClose?.()
    await logout()
    navigate(ROUTES.LOGIN)
  }

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 ease-in-out lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Bus className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold tracking-tight text-primary">
              SBMS
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg border-r-4 border-transparent px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-primary bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/60'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
