import {
  LayoutDashboard,
  Smile,
  History,
  Bus,
  Receipt,
  User,
} from 'lucide-react'
import { ROUTES } from '@/routes/paths'

export const navItems = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'My Child', path: ROUTES.MY_CHILD, icon: Smile },
  { label: 'Attendance History', path: ROUTES.ATTENDANCE, icon: History },
  { label: 'Bus Route', path: ROUTES.BUS_ROUTE, icon: Bus },
  { label: 'Invoices & Payments', path: ROUTES.INVOICES, icon: Receipt },
  { label: 'Profile', path: ROUTES.PROFILE, icon: User },
]
