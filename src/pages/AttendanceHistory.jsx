import { useState } from 'react'
import { Calendar, CalendarX, ChevronLeft, ChevronRight, Download, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { InfoPill } from '@/components/common/InfoPill'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useChildStatus } from '@/hooks/useApi'

const attendanceFilters = ['All Records', 'This Week', 'This Month']

export function AttendanceHistory() {
  const { selectedStudent } = useAuth()
  const [activeFilter, setActiveFilter] = useState('All Records')

  const childName = selectedStudent
    ? `${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`.trim()
    : ''

  // ── Live data – stale after 30 s, polled every 30 s in the background.
  // Navigating away and back within 30 s skips the API call entirely.
  const { data: statusData, isLoading: loading } = useChildStatus(
    selectedStudent?.student_id
  )

  // Derive attendance log from cached query data
  const attendanceLogs = (() => {
    if (!statusData?.attendance) return []
    const rec = statusData.attendance
    const dateObj = new Date(rec.date || rec.created_at || Date.now())
    return [
      {
        id: rec.attendance_id || 1,
        date: dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        weekday: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
        boardingTime: rec.boarding_time
          ? new Date(rec.boarding_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
        dropoffTime: rec.drop_off_time
          ? new Date(rec.drop_off_time).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '-',
        status: rec.status || 'Boarded',
        tone: rec.status === 'Absent' ? 'danger' : rec.status === 'Dropped Off' ? 'success' : 'success',
      },
    ]
  })()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Attendance History
        </h1>
        <p className="mt-1 text-muted-foreground">
          Detailed log of school transit{childName ? ` for ${childName}` : ''}
        </p>
      </div>

      <SectionCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-lg bg-muted p-1">
          {attendanceFilters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeFilter === filter
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <InfoPill>
            <Calendar className="h-4 w-4 text-muted-foreground" />
            {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </InfoPill>
          <Button variant="outline">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="icon" aria-label="Download">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </SectionCard>

      <SectionCard className="p-0">
        {loading ? (
          <div className="flex items-center justify-center p-12 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" />
            <span>Loading attendance history...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="whitespace-nowrap px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Boarding Time
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Drop-off Time
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-6 py-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.length > 0 ? (
                  attendanceLogs.map((record) => (
                    <tr key={record.id} className="border-b border-border last:border-none">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            {record.status === 'Absent' ? (
                              <CalendarX className="h-4 w-4" />
                            ) : (
                              <Calendar className="h-4 w-4" />
                            )}
                          </span>
                          <div>
                            <p className="font-semibold text-foreground">{record.date}</p>
                            <p className="text-sm text-muted-foreground">{record.weekday}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-foreground">{record.boardingTime}</td>
                      <td className="px-6 py-4 text-foreground">{record.dropoffTime}</td>
                      <td className="px-6 py-4">
                        <StatusBadge label={record.status} tone={record.tone} />
                      </td>
                      <td className="px-6 py-4">
                        <ChevronRight className="h-4 w-4 text-primary" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>
                      <EmptyState
                        icon={Calendar}
                        title="No attendance records available"
                        description="Attendance records will appear here once school transit activity is logged."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {attendanceLogs.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing {attendanceLogs.length} record(s)
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" aria-label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" aria-label="Next page">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
