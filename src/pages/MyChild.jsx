import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Pencil,
  Printer,
  GraduationCap,
  MapPin,
  Building2,
  Share2,
  Phone,
  Mail,
  Bus,
  User,
  HeartPulse,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionCard } from '@/components/common/SectionCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { InfoTile } from '@/components/my-child/InfoTile'
import { GuardianContactRow } from '@/components/my-child/GuardianContactRow'
import { ROUTES } from '@/routes/paths'
import { useAuth } from '@/context/AuthContext'
import { useRoutes } from '@/hooks/useApi'

export function MyChild() {
  const { selectedStudent, user } = useAuth()
  const { data: routes = [] } = useRoutes(selectedStudent?.student_id)

  const studentRouteId = selectedStudent?.stops?.[0]?.route_id || selectedStudent?.stops?.[0]?.pivot?.route_id

  const activeRoute = useMemo(() => {
    if (!routes || routes.length === 0) return null
    if (studentRouteId) {
      const foundByRouteId = routes.find((r) => String(r.route_id) === String(studentRouteId))
      if (foundByRouteId) return foundByRouteId
    }
    if (selectedStudent?.student_id) {
      const foundByStudentId = routes.find((r) =>
        r.stops?.some((s) => String(s.student_id) === String(selectedStudent.student_id)) ||
        r.students?.some((st) => String(st.student_id) === String(selectedStudent.student_id))
      )
      if (foundByStudentId) return foundByStudentId
    }
    return routes[0]
  }, [routes, selectedStudent, studentRouteId])
  const activeDriver = activeRoute?.driver

  const childName = selectedStudent
    ? `${selectedStudent.first_name || ''} ${selectedStudent.last_name || ''}`.trim()
    : 'No Student Assigned'

  const emergencyPhone = user?.phone_number || 'No emergency contact on file'
  const guardianName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Primary Guardian'

  const medicalInfo = selectedStudent?.medicalRecord

  return (
    <div className="space-y-6">
      <div>
        <Link
          to={ROUTES.DASHBOARD}
          className="inline-flex items-center gap-1.5 text-sm font-medium uppercase tracking-wide text-primary hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          Child&apos;s Profile - {childName}
        </h1>
        <div className="flex gap-3">
          <Button variant="outline">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
          <Button>
            <Printer className="h-4 w-4" />
            Export ID Card
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard className="relative overflow-hidden">
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-14 w-14" />
                </div>
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground">
                  Verified
                </span>
              </div>

              <div>
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {selectedStudent?.grade_level || 'Grade 5'}
                </span>
                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  {childName}
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Student Code:{' '}
                  <span className="font-medium text-primary">
                    {selectedStudent?.student_code || '-'}
                  </span>
                </p>
              </div>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Enrollment
                </p>
                <p className="mt-1 flex items-center gap-1.5 font-medium text-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {selectedStudent?.enrollment_status || 'Active'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Date of Birth
                </p>
                <p className="mt-1 font-semibold text-foreground">
                  {selectedStudent?.date_of_birth
                    ? new Date(selectedStudent.date_of_birth).toLocaleDateString()
                    : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Gender
                </p>
                <p className="mt-1 font-semibold text-foreground capitalize">
                  {selectedStudent?.gender || '-'}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader icon={GraduationCap} title="School & Location Information" />

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoTile
                icon={MapPin}
                label="Pickup Address"
                value={selectedStudent?.pickup_add || 'Not assigned'}
              />
              <InfoTile
                icon={Building2}
                label="Drop-off Address"
                value={selectedStudent?.dropoff_add || 'Not assigned'}
              />
            </div>
          </SectionCard>

          {medicalInfo && (
            <SectionCard>
              <SectionHeader icon={HeartPulse} title="Medical Record" />
              <div className="mt-3 space-y-2 text-sm">
                {medicalInfo.medical_conditions && (
                  <p>
                    <span className="font-semibold text-foreground">Conditions: </span>
                    <span className="text-muted-foreground">{medicalInfo.medical_conditions}</span>
                  </p>
                )}
                {medicalInfo.special_needs && (
                  <p>
                    <span className="font-semibold text-foreground">Special Needs: </span>
                    <span className="text-muted-foreground">{medicalInfo.special_needs}</span>
                  </p>
                )}
                {medicalInfo.emergency_notes && (
                  <p>
                    <span className="font-semibold text-foreground">Notes: </span>
                    <span className="text-muted-foreground">{medicalInfo.emergency_notes}</span>
                  </p>
                )}
              </div>
            </SectionCard>
          )}

          <SectionCard>
            <SectionHeader
              icon={Share2}
              title="Guardian Contacts"
              action={
                <button
                  type="button"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Manage Access
                </button>
              }
            />

            <div className="mt-4 space-y-3">
              <GuardianContactRow
                name={guardianName}
                role="Primary Guardian"
                phone={user?.phone_number || 'N/A'}
                email={user?.email || 'N/A'}
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard tone="destructive">
            <p className="border-b border-destructive/20 pb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Emergency Contact
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <Phone className="h-4 w-4" />
              </span>
              <div>
                <p className="font-semibold text-foreground">
                  {guardianName}
                </p>
                <p className="text-sm font-semibold text-destructive">
                  {emergencyPhone}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard className="relative overflow-hidden">
            <Bus className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 text-muted-foreground/10" />
            <h2 className="text-lg font-bold text-foreground">Transit Overview</h2>
            <div className="mt-4 space-y-3">
              {[
                { label: 'Enrollment Status', value: selectedStudent?.enrollment_status || 'Enrolled', highlight: true },
                { label: 'Pickup Stop', value: selectedStudent?.pickup_add ? 'Assigned' : 'Not assigned' },
                { label: 'Dropoff Stop', value: selectedStudent?.dropoff_add ? 'Assigned' : 'Not assigned' },
                { label: 'Assigned Driver', value: activeDriver ? `${activeDriver.first_name || ''} ${activeDriver.last_name || ''}`.trim() : 'Not assigned' },
                { label: 'Driver Phone', value: activeDriver?.phone_number || activeDriver?.phone || 'N/A' },
                { label: 'Driver Email', value: activeDriver?.email || 'N/A' },
              ].map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-lg bg-muted/60 p-3"
                >
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p
                    className={
                      highlight
                        ? 'font-semibold text-primary'
                        : 'font-semibold text-foreground'
                    }
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
