import { useState } from 'react'
import { Camera, ChevronRight, Info, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { SectionCard } from '@/components/common/SectionCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { useAuth } from '@/context/AuthContext'

const initialPreferences = [
  {
    key: 'sms',
    label: 'SMS Notifications',
    description: 'Receive real-time text alerts when the bus arrives.',
    enabled: true,
  },
  {
    key: 'email',
    label: 'Email Reports',
    description: 'Receive daily transit and attendance digests via email.',
    enabled: true,
  },
  {
    key: 'push',
    label: 'App Push Notifications',
    description: 'Instant status changes for boarding and drop-offs.',
    enabled: true,
  },
]

export function Profile() {
  const { user, students, setSelectedStudent } = useAuth()
  const [preferences, setPreferences] = useState(initialPreferences)

  const fullName = user
    ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Guardian User'
    : 'Guardian User'

  const guardianIdCode = user?.user_id ? `G-${String(user.user_id).padStart(4, '0')}` : 'G-0001'

  function togglePreference(key) {
    setPreferences((current) =>
      current.map((pref) =>
        pref.key === key ? { ...pref, enabled: !pref.enabled } : pref
      )
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your guardian details and preferences.
          </p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard>
            <div className="flex flex-col gap-6 sm:flex-row">
              <div className="relative h-24 w-24 shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <User className="h-10 w-10" />
                </div>
                <button
                  type="button"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  aria-label="Change photo"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
                <p className="mt-1 text-muted-foreground">
                  Guardian ID: {guardianIdCode}
                </p>
                <span className="mt-2 inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  Verified Guardian Account
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  defaultValue={fullName}
                  placeholder="Not provided"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={user?.email || ''}
                  placeholder="Not provided"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue={user?.phone_number || ''}
                  placeholder="Not provided"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Phone</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  defaultValue={user?.phone_number || ''}
                  placeholder="Not provided"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader icon={Shield} title="Security & Password" />

            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" placeholder="Enter new" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New</Label>
                <Input id="confirmPassword" type="password" placeholder="Confirm" />
              </div>
            </div>

            <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Info className="h-3.5 w-3.5" />
              Password must be at least 8 characters.
            </p>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl bg-primary p-6 text-primary-foreground">
            <h2 className="text-lg font-bold">Linked Students ({students.length})</h2>
            <div className="mt-4">
              {students.length > 0 ? (
                <div className="space-y-2">
                  {students.map((student) => (
                    <button
                      key={student.student_id}
                      type="button"
                      onClick={() => setSelectedStudent(student)}
                      className="flex w-full items-center justify-between rounded-lg bg-primary-foreground/10 px-4 py-3 text-left hover:bg-primary-foreground/15 transition-colors"
                    >
                      <span className="font-medium">
                        {student.first_name} {student.last_name} ({student.student_code})
                      </span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-primary-foreground/80">
                  No students linked to this account
                </p>
              )}
            </div>
          </div>

          <SectionCard>
            <h2 className="text-lg font-bold text-foreground">Notifications</h2>
            <div className="mt-4 space-y-4">
              {preferences.map((pref) => (
                <div key={pref.key} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">{pref.label}</p>
                    <p className="text-sm text-muted-foreground">{pref.description}</p>
                  </div>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={() => togglePreference(pref.key)}
                  />
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="rounded-xl border border-dashed border-border bg-muted/40 p-5">
            <p className="font-semibold text-foreground">Data Privacy</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Your guardian data is protected under SBMS encryption standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
