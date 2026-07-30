import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Bus,
  CalendarCheck,
  Clock,
  MapPin,
  ArrowRight,
  Activity,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Flag,
} from 'lucide-react'
import { StatCard } from '@/components/dashboard/StatCard'
import { ActivityItem } from '@/components/dashboard/ActivityItem'
import { SectionCard } from '@/components/common/SectionCard'
import { EmptyState } from '@/components/common/EmptyState'
import { useAuth } from '@/context/AuthContext'
import { useChildStatus, useRoutes, useBuses } from '@/hooks/useApi'
import { ROUTES } from '@/routes/paths'

export function Dashboard() {
  const { user, selectedStudent } = useAuth()

  const guardianName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Guardian'
    : 'Guardian'

  const childName = selectedStudent
    ? `${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`.trim()
    : null

  // ── Live child status (30 s polling)
  const { data: statusData, isLoading: statusLoading } = useChildStatus(
    selectedStudent?.student_id
  )

  // ── Route + bus data (5 min cache)
  const { data: routes = [], isLoading: routesLoading } = useRoutes(selectedStudent?.student_id)
  const { data: buses = [], isLoading: busesLoading } = useBuses()

  const isLoading = statusLoading || routesLoading || busesLoading

  // Derive dashboard values from live data
  const childStatus = statusData?.attendance?.status ?? null
  const attendance = statusData?.attendance ?? null

  const activeRoute =
    routes.find((r) =>
      r.stops?.some((s) => s.student_id === selectedStudent?.student_id)
    ) || routes[0]

  const activeBus = activeRoute?.buses?.[0] || buses[0]
  const activeDriver = activeRoute?.driver

  const busLabel = activeBus
    ? activeBus.manufacturer
      ? `${activeBus.manufacturer} ${activeBus.model || ''}`.trim()
      : `Bus ${activeBus.bus_number}`
    : 'No bus assigned'

  const boardingTime = attendance?.boarding_time
    ? new Date(attendance.boarding_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null
  const dropoffTime = attendance?.drop_off_time
    ? new Date(attendance.drop_off_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // Build recent activity feed from live data
  const recentActivity = useMemo(() => {
    const items = []
    if (attendance?.boarding_time) {
      items.push({
        type: 'boarded',
        title: `${childName || 'Student'} boarded the bus`,
        description: activeRoute?.route_name || 'Assigned Route',
        timestamp: boardingTime,
        tone: 'success',
      })
    }
    if (attendance?.drop_off_time) {
      items.push({
        type: 'dropoff',
        title: `${childName || 'Student'} was safely dropped off`,
        description: selectedStudent?.pickup_add || 'Drop-off location',
        timestamp: dropoffTime,
        tone: 'success',
      })
    }
    return items
  }, [attendance?.boarding_time, attendance?.drop_off_time, childName, activeRoute?.route_name, boardingTime, dropoffTime, selectedStudent?.pickup_add])

  const transportRows = [
    {
      label: 'Pickup Address',
      value: selectedStudent?.pickup_add || 'Not assigned',
    },
    {
      label: 'Drop-off Address',
      value: selectedStudent?.dropoff_add || 'Not assigned',
    },
    {
      label: 'Assigned Driver',
      value: activeDriver
        ? `${activeDriver.first_name || ''} ${activeDriver.last_name || ''}`.trim()
        : 'Not assigned',
    },
    {
      label: 'Driver Phone',
      value: activeDriver?.phone_number || activeDriver?.phone || 'N/A',
    },
    {
      label: 'Driver Email',
      value: activeDriver?.email || 'N/A',
    },
    {
      label: 'Bus Route',
      value: activeRoute?.route_name || 'Not assigned',
    },
  ]

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{today}</p>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground sm:text-3xl">
            Good morning, {guardianName.split(' ')[0]} 👋
          </h1>
          {childName && (
            <p className="mt-1 text-muted-foreground">
              Tracking{' '}
              <span className="font-semibold text-foreground">{childName}</span>
            </p>
          )}
        </div>
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span>Updating live data…</span>
          </div>
        )}
      </div>

      {/* ── Route Completed Banner (shown when child is Dropped Off) ── */}
      {childStatus === 'Dropped Off' && selectedStudent && (
        <div className="relative overflow-hidden rounded-2xl p-6"
          style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
            boxShadow: '0 8px 32px rgba(6, 78, 59, 0.35)'
          }}
        >
          {/* Decorative blobs */}
          <div style={{ position: 'absolute', right: '-30px', top: '-30px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: '80px', bottom: '-50px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Flag size={28} color="#6ee7b7" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  Route Completed
                </p>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff', margin: '4px 0 0 0', lineHeight: 1.2 }}>
                  {childName} has been safely dropped off 🎉
                </h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', margin: '4px 0 0 0' }}>
                  {activeRoute?.route_name || 'Route'} is complete
                  {boardingTime ? ` · Boarded at ${boardingTime}` : ''}
                  {dropoffTime ? ` · Dropped off at ${dropoffTime}` : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
              <CheckCircle2 size={20} color="#6ee7b7" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#6ee7b7' }}>All clear</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Bus}
          label="Child Status"
          title={
            !selectedStudent
              ? 'No student assigned'
              : childStatus
              ? childStatus
              : 'No data yet'
          }
          badge={childStatus === 'Boarded' ? 'Live' : childStatus === 'Dropped Off' ? 'Done' : undefined}
          footnote={
            childStatus === 'Boarded'
              ? `Boarded at ${boardingTime}`
              : childStatus === 'Dropped Off'
              ? `Dropped off at ${dropoffTime}`
              : childStatus === 'Absent'
              ? 'Marked absent today'
              : undefined
          }
          tone={childStatus === 'Boarded' || childStatus === 'Dropped Off' ? 'success' : undefined}
        />
        <StatCard
          icon={Bus}
          label="Today's Bus"
          title={busLabel}
          footnote={
            activeBus?.plate_number ? `Plate: ${activeBus.plate_number}` : undefined
          }
        />
        <StatCard
          icon={CalendarCheck}
          label="Attendance Today"
          title={
            childStatus
              ? childStatus
              : 'Not recorded yet'
          }
          footnote={
            dropoffTime
              ? `Dropped off at ${dropoffTime}`
              : childStatus === 'Boarded'
              ? `Boarded at ${boardingTime}`
              : 'Awaiting activity'
          }
          tone={childStatus === 'Boarded' || childStatus === 'Dropped Off' ? 'success' : undefined}
        />
        <StatCard
          icon={Clock}
          label="Est. Arrival"
          title={boardingTime ? '07:45 AM' : '-'}
          footnote={boardingTime ? 'Based on current route' : 'Bus not yet departed'}
        />
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">Recent Activity</h2>
              </div>
              <Link
                to={ROUTES.ATTENDANCE}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((item, i) => (
                  <ActivityItem key={i} {...item} />
                ))
              ) : (
                <EmptyState
                  icon={Activity}
                  title="No activity today"
                  description="Boarding and drop-off events will appear here in real time."
                />
              )}
            </div>
          </SectionCard>
        </div>

        {/* Transport Overview */}
        <div className="space-y-6">
          <SectionCard>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h2 className="text-base font-bold text-foreground">Transport</h2>
              </div>
              <Link
                to={ROUTES.BUS_ROUTE}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {transportRows.map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg bg-muted/60 px-4 py-3"
                >
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="max-w-[55%] truncate text-right text-sm font-semibold text-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Quick Links */}
          <SectionCard>
            <h2 className="text-base font-bold text-foreground">Quick Actions</h2>
            <div className="mt-3 space-y-2">
              {[
                { label: 'View Child Profile', to: ROUTES.MY_CHILD },
                { label: 'Attendance History', to: ROUTES.ATTENDANCE },
                { label: 'Billing & Payments', to: ROUTES.INVOICES },
                { label: 'Notifications', to: ROUTES.NOTIFICATIONS },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {label}
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* ── Outstanding payment banner ── */}
      {selectedStudent && !childStatus && !statusLoading && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            No transit activity recorded for today yet. Data will update automatically
            once your child boards the bus.
          </p>
        </div>
      )}
    </div>
  )
}