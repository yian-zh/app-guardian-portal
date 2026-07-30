import { useState, useCallback } from 'react'
import { Calendar, CalendarX, ChevronLeft, ChevronRight, Download, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionCard } from '@/components/common/SectionCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { InfoPill } from '@/components/common/InfoPill'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useAttendanceHistory } from '@/hooks/useApi'
import { usePagination } from '@/hooks/usePagination'

const FILTER_OPTIONS = [
  { label: 'All Records', value: '' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
]

function formatTime(timeStr) {
  if (!timeStr) return '-'
  return new Date(timeStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return {
    full: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }),
  }
}

export function AttendanceHistory() {
  const { selectedStudent } = useAuth()
  const { page, perPage, goToPage, goNext, goPrev } = usePagination({ perPage: 50 })

  const childName = selectedStudent
    ? `${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`.trim()
    : ''

  const [activeFilter, setActiveFilter] = useState(FILTER_OPTIONS[0].value)

  const filterValue = activeFilter || undefined

  const { data, isLoading } = useAttendanceHistory(selectedStudent?.student_id, {
    page,
    perPage,
    filter: filterValue,
  })

  const records = data?.records ?? []
  const totalPages = data?.totalPages ?? 1

  const handleFilterChange = useCallback((value) => {
    setActiveFilter(value)
    goToPage(1)
  }, [goToPage])

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
          {FILTER_OPTIONS.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => handleFilterChange(value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                activeFilter === value
                  ? 'bg-background text-primary shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
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
        {isLoading ? (
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
                {records.length > 0 ? (
                  records.map((rec) => {
                    const { full, weekday } = formatDate(rec.date || rec.created_at)
                    const tone = rec.status === 'Absent' ? 'danger' : 'success'
                    return (
                      <tr key={rec.attendance_id || rec.id} className="border-b border-border last:border-none">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              {rec.status === 'Absent' ? (
                                <CalendarX className="h-4 w-4" />
                              ) : (
                                <Calendar className="h-4 w-4" />
                              )}
                            </span>
                            <div>
                              <p className="font-semibold text-foreground">{full}</p>
                              <p className="text-sm text-muted-foreground">{weekday}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-foreground">{formatTime(rec.boarding_time)}</td>
                        <td className="px-6 py-4 text-foreground">{formatTime(rec.drop_off_time)}</td>
                        <td className="px-6 py-4">
                          <StatusBadge label={rec.status || 'Boarded'} tone={tone} />
                        </td>
                        <td className="px-6 py-4">
                          <ChevronRight className="h-4 w-4 text-primary" />
                        </td>
                      </tr>
                    )
                  })
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

        {records.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goPrev} disabled={page <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goNext} disabled={page >= totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
