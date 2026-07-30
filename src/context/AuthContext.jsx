import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { useStudents } from '@/hooks/useApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('guardian_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [selectedStudent, setSelectedStudent] = useState(null)
  const queryClient = useQueryClient()

  const guardianId = user?.guardian?.guardian_id || user?.user_id || user?.id

  const {
    data: studentsData,
    isLoading: studentsLoading,
  } = useStudents(guardianId, {
    enabled: !!(token && user),
  })

  const students = useMemo(() => {
    if (!studentsData || !user) return []
    return studentsData.filter((student) => {
      if (!student.guardians || student.guardians.length === 0) return false
      return student.guardians.some(
        (g) => String(g.user_id) === String(user.user_id) ||
               String(g.user?.user_id) === String(user.user_id) ||
               String(g.guardian_id) === String(user?.guardian?.guardian_id)
      )
    })
  }, [studentsData, user])

  useEffect(() => {
    if (students.length > 0 && !selectedStudent) {
      setSelectedStudent(students[0])
    }
  }, [students, selectedStudent])

  const loading = !!(token && user && studentsLoading)

  async function login(email, password) {
    const data = await authService.login(email, password)
    const loggedUser = data.user
    const authToken = data.token

    localStorage.setItem('token', authToken)
    localStorage.setItem('guardian_user', JSON.stringify(loggedUser))

    setToken(authToken)
    setUser(loggedUser)

    const newGuardianId = loggedUser?.user_id || loggedUser?.id
    queryClient.invalidateQueries({ queryKey: ['students', newGuardianId] })

    return data
  }

  async function logout() {
    await authService.logout()
    queryClient.clear()
    setUser(null)
    setToken(null)
    setSelectedStudent(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        students,
        selectedStudent,
        setSelectedStudent,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
