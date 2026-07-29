// Local placeholder data for the Profile page, standing in for the
// Laravel API response until a real guardian account is registered.
export const guardianIdLabel = '-'

export const accountVerified = false

export const profileFields = {
  email: '',
  phone: '',
  emergencyContact: '',
}

// No students linked to this guardian account yet.
export const linkedStudents = []

export const notificationPreferences = [
  {
    key: 'emailReports',
    label: 'Email Reports',
    description: 'Weekly attendance logs',
    enabled: true,
  },
  {
    key: 'pushNotifications',
    label: 'Push Notifications',
    description: 'All system alerts',
    enabled: true,
  },
]
