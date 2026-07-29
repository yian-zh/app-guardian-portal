import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@/components/layout/MainLayout'
import { Loader2 } from 'lucide-react'
import { ROUTES } from '@/routes/paths'

const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const MyChild = lazy(() => import('@/pages/MyChild').then((m) => ({ default: m.MyChild })))
const AttendanceHistory = lazy(() => import('@/pages/AttendanceHistory').then((m) => ({ default: m.AttendanceHistory })))
const BusRoute = lazy(() => import('@/pages/BusRoute').then((m) => ({ default: m.BusRoute })))
const InvoicesPayments = lazy(() => import('@/pages/InvoicesPayments').then((m) => ({ default: m.InvoicesPayments })))
const Notifications = lazy(() => import('@/pages/Notifications').then((m) => ({ default: m.Notifications })))
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })))

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.MY_CHILD} element={<MyChild />} />
          <Route path={ROUTES.ATTENDANCE} element={<AttendanceHistory />} />
          <Route path={ROUTES.BUS_ROUTE} element={<BusRoute />} />
          <Route path={ROUTES.INVOICES} element={<InvoicesPayments />} />
          <Route path={ROUTES.NOTIFICATIONS} element={<Notifications />} />
          <Route path={ROUTES.PROFILE} element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </Suspense>
  )
}
