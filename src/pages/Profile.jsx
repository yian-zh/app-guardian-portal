import { useState, useEffect } from 'react'
import { Camera, ChevronRight, Info, Shield, User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { SectionCard } from '@/components/common/SectionCard'
import { SectionHeader } from '@/components/common/SectionHeader'
import { useAuth } from '@/context/AuthContext'
import { useUpdateProfile } from '@/hooks/useApi'

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
  const { user, students, setSelectedStudent, updateUser } = useAuth()
  const [preferences, setPreferences] = useState(initialPreferences)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')

  const [feedback, setFeedback] = useState(null)
  const updateProfileMutation = useUpdateProfile()

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setEmail(user.email || '')
      setPhone(user.phone_number || '')
      setEmergencyPhone(user.phone_number || '')
    }
  }, [user])

  const fullName = `${firstName} ${lastName}`.trim() || user?.username || 'Guardian User'
  const guardianIdCode = user?.user_id ? `G-${String(user.user_id).padStart(4, '0')}` : 'G-0001'

  function togglePreference(key) {
    setPreferences((current) =>
      current.map((pref) =>
        pref.key === key ? { ...pref, enabled: !pref.enabled } : pref
      )
    )
  }

  async function handleSaveChanges(e) {
    e?.preventDefault()
    setFeedback(null)

    const userId = user?.user_id || user?.id || user?.guardian?.user_id

    if (!userId) {
      setFeedback({ type: 'error', message: 'Unable to identify current guardian account ID.' })
      return
    }

    const payload = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone_number: phone,
    }

    try {
      await updateProfileMutation.mutateAsync({ userId, data: payload })
      updateUser(payload)
      setFeedback({ type: 'success', message: 'Profile updated successfully!' })
    } catch (err) {
      console.error('Failed to update profile:', err)
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save changes. Please try again.'
      setFeedback({ type: 'error', message: errorMsg })
    }
  }

  return (
    <form onSubmit={handleSaveChanges} className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your guardian details and preferences.
          </p>
        </div>
        <Button type="submit" disabled={updateProfileMutation.isPending}>
          {updateProfileMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>

      {feedback && (
        <div
          className={`flex items-center gap-2 rounded-lg p-4 text-sm font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
              : 'bg-destructive/10 text-destructive border border-destructive/20'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

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
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="emergencyContact">Emergency Phone</Label>
                <Input
                  id="emergencyContact"
                  type="tel"
                  value={emergencyPhone}
                  onChange={(e) => setEmergencyPhone(e.target.value)}
                  placeholder="Enter emergency phone number"
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
    </form>
  )
}

