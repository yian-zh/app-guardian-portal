import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routeService } from '@/services/routeService'
import { studentService } from '@/services/studentService'
import { billingService } from '@/services/billingService'

export function useStudents(guardianId, options = {}) {
  return useQuery({
    queryKey: ['students', guardianId],
    queryFn: async () => {
      const res = await studentService.getStudents({ guardianId })
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

function extractData(res) {
  if (Array.isArray(res)) return res
  if (res?.data && Array.isArray(res.data)) return res.data
  return []
}

export function useRoutes(studentId, options = {}) {
  return useQuery({
    queryKey: ['routes', studentId || 'all'],
    queryFn: async () => {
      const res = await routeService.getRoutes({ studentId })
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5,
    enabled: options.enabled !== undefined ? options.enabled : Boolean(studentId),
    ...options,
  })
}

export function useBuses() {
  return useQuery({
    queryKey: ['buses'],
    queryFn: async () => {
      const res = await routeService.getBuses()
      return extractData(res)
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useRouteManifest(routeId) {
  return useQuery({
    queryKey: ['routeManifest', routeId],
    queryFn: async () => {
      const res = await routeService.getRouteManifest(routeId)
      return extractData(res)
    },
    enabled: !!routeId,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
  })
}

export function useAttendanceHistory(studentId, { page = 1, perPage = 50, filter } = {}) {
  return useQuery({
    queryKey: ['attendanceHistory', studentId, { page, perPage, filter }],
    queryFn: async () => {
      const res = await studentService.getAttendanceHistory(studentId, { page, perPage, filter })
      return {
        records: extractData(res),
        totalPages: res?.last_page ?? res?.meta?.last_page ?? 1,
      }
    },
    enabled: !!studentId,
    staleTime: 1000 * 60 * 2,
  })
}

export function useChildStatus(studentId) {
  return useQuery({
    queryKey: ['childStatus', studentId],
    queryFn: () => studentService.getChildStatus(studentId),
    enabled: !!studentId,
    staleTime: 1000 * 15,
    refetchInterval: 1000 * 15,
    refetchOnWindowFocus: true,
  })
}

export function useBillingLedger(guardianId, { page = 1, perPage = 50, status } = {}) {
  return useQuery({
    queryKey: ['billingLedger', guardianId, { page, perPage, status }],
    queryFn: () => billingService.getLedger(guardianId, { page, perPage, status }),
    enabled: !!guardianId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useInvoice(invoiceId) {
  return useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => billingService.getInvoice(invoiceId),
    enabled: !!invoiceId,
  })
}

export function usePayInvoice(guardianId) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload) => billingService.payInvoice(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['billingLedger', guardianId] })
    },
  })
}
