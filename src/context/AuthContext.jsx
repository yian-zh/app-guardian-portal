import { createContext, useContext, useState, useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { studentService } from '@/services/studentService'
import { fetchAllPages } from '@/services/pagination'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('guardian_user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [selectedStudent, setSelectedStudent] = useState(null)
  const queryClient = useQueryClient()

  const {
    data: studentsData,
    isLoading: studentsLoading,
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchAllPages((params) => studentService.getStudents(params)),
    enabled: !!(token && user),
    staleTime: 1000 * 60 * 5,
    select: (allStudents) => {
      if (!user) return []
      const matched = allStudents.filter((student) => {
        if (!student.guardians || student.guardians.length === 0) return true
        return student.guardians.some(
          (g) => g.user_id === user.user_id || g.user?.user_id === user.user_id
        )
      })
      return matched.length > 0 ? matched : allStudents
    },
  })

  const students = studentsData ?? []

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

    queryClient.invalidateQueries({ queryKey: ['students'] })

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
