// Local placeholder data for the Bus Route page, standing in for the
// Laravel API response until a route is actually assigned.
export const routeLabel = 'Not assigned'

export const scheduleStops = [
  {
    id: 'pickup',
    label: 'Morning Pickup',
    address: 'Not assigned',
    time: '-',
  },
  {
    id: 'dropoff',
    label: 'Afternoon Drop-off',
    address: 'Not assigned',
    time: '-',
  },
]

// No vehicle or driver assigned yet.
export const vehicle = null
export const driver = null

export const liveTrackingActive = false

// Each stop is expected to look like:
// { name, scheduledTime, actualTime, status }
// Empty until a route with live stops is assigned.
export const routeStops = []
