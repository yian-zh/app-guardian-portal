// Local sample data for the Dashboard page, standing in for the
// Laravel API response until the real endpoint is wired up.
// Values are left empty/neutral to represent a fresh system before
// any guardian or student data has been registered.
export const dashboardData = {
  guardianFirstName: '',
  childFirstName: '',
  today: 'Wednesday, Oct 25, 2023',

  // No outstanding payment record for a fresh account.
  outstandingPayment: null,

  stats: {
    childStatus: {
      badge: null,
      title: 'No student assigned',
      footnote: '',
    },
    todaysBus: {
      title: 'No bus assigned',
      footnote: '',
    },
    attendanceToday: {
      title: 'No attendance data',
      footnote: '',
    },
    estArrival: {
      title: '-',
      footnote: '',
    },
  },

  transportation: {
    pickupAddress: 'Not assigned',
    dropoffAddress: 'Not assigned',
    assignedDriver: 'Not assigned',
    assignedBusRoute: 'Not assigned',
    schedule: [
      { label: 'Morning Pickup', time: '-' },
      { label: 'School Arrival', time: '-' },
      { label: 'Afternoon Departure', time: '-' },
      { label: 'Home Drop-off', time: '-' },
    ],
  },

  // No activity history for a fresh account.
  recentActivity: [],
}
