// Local placeholder data for the Attendance History page, standing in
// for the Laravel API response until real attendance records exist.
export const attendanceFilters = ['Daily', 'Weekly', 'Monthly']

export const attendanceDateRangeLabel = 'Select date range'

// Each record is expected to look like:
// { date, weekday, boardingTime, dropoffTime, status, tone }
// Empty until a student is enrolled and attendance is recorded.
export const attendanceRecords = []
