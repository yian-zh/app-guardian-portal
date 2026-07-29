// Local sample data for the My Child page, standing in for the
// Laravel API response until the real endpoint is wired up.
// Values are left empty/neutral to represent a fresh system before
// any student or guardian data has been registered.
export const childProfile = {
  name: '',
  gradeLabel: 'Not enrolled',
  studentId: '-',
  verified: false,
  enrollmentStatus: 'Not enrolled',
  joiningDate: '-',
  house: '-',
}

// No emergency contact on file for a fresh account.
export const emergencyContact = {
  name: '',
  phone: '',
}

export const transitStatus = [
  { label: 'Morning Bus', value: 'Not assigned', highlight: false },
  { label: 'Evening Bus', value: 'Not assigned', highlight: false },
  { label: 'Usual Stop', value: 'Not assigned', highlight: false },
]

export const schoolInfo = {
  schoolName: 'Not assigned',
  schoolAddress: '',
  classroom: 'Not assigned',
  classroomDetail: '',
}

// No guardian contacts on file for a fresh account.
export const guardianContacts = []
