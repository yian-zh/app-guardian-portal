import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function StudentSwitcher() {
  const { students, selectedStudent, setSelectedStudent } = useAuth()
  const [open, setOpen] = useState(false)

  if (students.length <= 1) return null

  function handleSelect(student) {
    setSelectedStudent(student)
    setOpen(false)
  }

  return (
    <div className="relative ml-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <span>{selectedStudent?.first_name} {selectedStudent?.last_name}</span>
        <span className="text-xs text-muted-foreground">({selectedStudent?.student_code})</span>
        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border border-border bg-popover p-1 shadow-lg z-50">
            {students.map((student) => (
              <button
                key={student.student_id}
                type="button"
                onClick={() => handleSelect(student)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-left transition-colors ${
                  student.student_id === selectedStudent?.student_id
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                </div>
                <div>
                  <p>{student.first_name} {student.last_name}</p>
                  <p className="text-xs text-muted-foreground">{student.student_code}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
