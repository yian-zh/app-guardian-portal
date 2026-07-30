import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { MapPin, GraduationCap, Bus, Phone, Mail, Route as RouteIcon, Loader2, CheckCircle2, Flag, Navigation, User } from 'lucide-react'
import { SectionCard } from '@/components/common/SectionCard'
import { EmptyState } from '@/components/common/EmptyState'
import { ScheduleStop } from '@/components/bus-route/ScheduleStop'
import { useAuth } from '@/context/AuthContext'
import { useRoutes, useBuses, useRouteManifest, useChildStatus } from '@/hooks/useApi'

export function BusRoute() {
  const { selectedStudent } = useAuth()

  // ── Cached queries ─────────────────────────────────────────────────────────
  const { data: routes = [], isLoading: routesLoading } = useRoutes(selectedStudent?.student_id)
  const { data: buses = [], isLoading: busesLoading } = useBuses()
  const { data: statusData, isLoading: statusLoading } = useChildStatus(selectedStudent?.student_id)

  const childStatus = statusData?.attendance?.status ?? null
  const attendance = statusData?.attendance ?? null
  const boardingTime = attendance?.boarding_time
    ? new Date(attendance.boarding_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null
  const dropoffTime = attendance?.drop_off_time
    ? new Date(attendance.drop_off_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  // Determine which route belongs to this student (or fall back to the first)
  const activeRoute =
    routes.find((r) =>
      r.stops?.some((s) => s.student_id === selectedStudent?.student_id)
    ) || routes[0]

  const { data: manifestStops = [], isLoading: manifestLoading } =
    useRouteManifest(activeRoute?.route_id)

  const loading = routesLoading || busesLoading || manifestLoading || statusLoading

  // ── Derived data ───────────────────────────────────────────────────────────
  const activeBus = activeRoute?.buses?.[0] || buses[0]
  const activeDriver = activeRoute?.driver

  const scheduleStops = [
    {
      id: 'pickup',
      icon: MapPin,
      title: 'Morning Pickup',
      location: selectedStudent?.pickup_add || activeRoute?.start_location || activeRoute?.stops?.[0]?.stop_address || 'St 310, Boeung Keng Kang 1 (BKK1), Phnom Penh',
      estimatedTime: '07:15 AM',
      note: 'Please arrive 5 mins early',
    },
    {
      id: 'dropoff',
      icon: GraduationCap,
      title: 'School Drop-off',
      location: selectedStudent?.dropoff_add || activeRoute?.end_location || 'Hun Sen Boulevard, ISPP Campus, Phnom Penh',
      estimatedTime: '07:45 AM',
      note: 'Official morning arrival',
    },
  ]

  const routeStops =
    manifestStops.length > 0
      ? manifestStops.map((st, idx) => ({
          order: st.stop_order || idx + 1,
          name: st.stop_address || `Stop #${st.stop_order || idx + 1}`,
          status: st.student
            ? `${st.student.first_name} ${st.student.last_name}`
            : (selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : 'Scheduled Stop'),
        }))
      : activeRoute?.stops && activeRoute.stops.length > 0
      ? activeRoute.stops.map((st, idx) => ({
          order: st.stop_order || idx + 1,
          name: st.stop_address || `Stop #${st.stop_order || idx + 1}`,
          status: selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : 'Scheduled Stop',
        }))
      : [
          {
            order: 1,
            name: selectedStudent?.pickup_add || 'St 310, Boeung Keng Kang 1 (BKK1), Phnom Penh',
            status: selectedStudent ? `${selectedStudent.first_name} ${selectedStudent.last_name}` : 'Passenger Pickup'
          }
        ]

  const scrollRef = useRef(null)
  const virtualizer = useVirtualizer({
    count: routeStops.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 64,
    overscan: 5,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Bus Route</h1>
        <p className="mt-1 text-muted-foreground">Live route info and schedule for your child</p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Fetching route &amp; live status...</span>
        </div>
      )}

      {/* ── Live Status Banner ── */}
      {selectedStudent && (
        <div
          className="relative overflow-hidden rounded-2xl p-5 transition-all"
          style={{
            background:
              childStatus === 'Dropped Off'
                ? 'linear-gradient(135deg, #064e3b 0%, #065f46 100%)'
                : childStatus === 'Boarded'
                ? 'linear-gradient(135deg, #0544a5 0%, #1d4ed8 100%)'
                : 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            boxShadow:
              childStatus === 'Dropped Off'
                ? '0 6px 24px rgba(6,78,59,0.35)'
                : childStatus === 'Boarded'
                ? '0 6px 24px rgba(5,68,165,0.3)'
                : '0 6px 24px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{ position: 'absolute', right: '-20px', top: '-20px', width: '130px', height: '130px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {childStatus === 'Dropped Off' ? (
                  <Flag size={24} color="#6ee7b7" />
                ) : childStatus === 'Boarded' ? (
                  <Navigation size={24} color="#93c5fd" />
                ) : (
                  <Bus size={24} color="#94a3b8" />
                )}
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                  {childStatus === 'Dropped Off' ? 'Route Completed' : childStatus === 'Boarded' ? 'En Route' : 'Today\'s Status'}
                </p>
                <p style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: '3px 0 0 0', lineHeight: 1.2 }}>
                  {childStatus === 'Dropped Off'
                    ? `Safely dropped off${dropoffTime ? ` at ${dropoffTime}` : ''} 🎉`
                    : childStatus === 'Boarded'
                    ? `On the bus${boardingTime ? ` since ${boardingTime}` : ''} 🚌`
                    : `Scheduled for pickup Today`}
                </p>
                {activeRoute?.route_name && (
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', margin: '2px 0 0 0' }}>
                    {activeRoute.route_name}
                    {childStatus === 'Dropped Off' && boardingTime ? ` · Boarded at ${boardingTime}` : ''}
                  </p>
                )}
              </div>
            </div>
            {childStatus === 'Dropped Off' && (
              <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                <CheckCircle2 size={18} color="#6ee7b7" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#6ee7b7' }}>Route complete</span>
              </div>
            )}
            {childStatus === 'Boarded' && (
              <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60a5fa', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd' }}>Live</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-foreground">
              Schedule &amp; Locations
            </h2>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary truncate max-w-[200px]">
              {activeRoute?.route_name || 'Route A1 - Express'}
            </span>
          </div>

          <div className="mt-5 space-y-6">
            {scheduleStops.map((stop) => (
              <ScheduleStop key={stop.id} {...stop} />
            ))}
          </div>
        </SectionCard>

        <SectionCard>
          <h2 className="text-lg font-bold text-foreground">Transport Details</h2>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl bg-muted/50 p-4 border border-border/40">
              {activeBus ? (
                <div className="flex items-center gap-3.5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bus className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-foreground text-sm">
                      {activeBus.manufacturer
                        ? `${activeBus.manufacturer} ${activeBus.model || ''}`
                        : `Bus ${activeBus.bus_number}`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Plate: <span className="font-medium text-foreground/80">{activeBus.plate_number}</span> &middot; Capacity: <span className="font-medium text-foreground/80">{activeBus.capacity}</span>
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No vehicle assigned</p>
              )}
            </div>

            <div className="rounded-xl bg-muted/50 p-4 border border-border/40">
              {activeDriver ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {`${activeDriver.first_name || ''} ${activeDriver.last_name || ''}`.trim() ||
                            'Licensed Driver'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">Assigned Driver</p>
                      </div>
                    </div>
                    {(activeDriver.phone_number || activeDriver.phone) && (
                      <a
                        href={`tel:${activeDriver.phone_number || activeDriver.phone}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                        aria-label="Call driver"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="pt-2.5 border-t border-border/40 space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Phone: <strong className="text-foreground font-medium">{activeDriver.phone_number || activeDriver.phone || 'N/A'}</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Email: <strong className="text-foreground font-medium">{activeDriver.email || 'N/A'}</strong></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-foreground text-sm">No Driver Assigned</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Contact school transport for updates</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Route Stops &amp; Progress
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time status of current journey
            </p>
          </div>
          <span className="flex items-center gap-2 self-start rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            Bus is Active
          </span>
        </div>

        <div ref={scrollRef} className="mt-5 overflow-auto" style={{ maxHeight: '600px' }}>
          {routeStops.length > 0 ? (
            <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const stop = routeStops[virtualItem.index]
                return (
                  <div
                    key={virtualItem.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                    className="flex items-center justify-between rounded-xl bg-muted/40 p-4 border border-border/40"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        #{stop.order || virtualItem.index + 1}
                      </span>
                      <p className="font-semibold text-foreground text-sm">{stop.name}</p>
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-background text-muted-foreground border border-border/60">
                      {stop.status}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={RouteIcon}
              title="No active route stops"
              description="Route stops will appear here once assigned to this bus route."
            />
          )}
        </div>
      </SectionCard>
    </div>
  )
}
