import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routeService } from '@/services/routeService'
import { studentService } from '@/services/studentService'
import { billingService } from '@/services/billingService'

export function useStudents(guardianId, options = {}) {
  return useQuery({
    queryKey: ['students', guardianId],
    queryFn: async () => {
      const res = await studentService.getStudents({ guardianId, perPage: 100 })
      if (Array.isArray(res)) return res
      return res.data ?? []
    },
    staleTime: 1000 * 60 * 5,
    ...options,
  })
}

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const envelope = await routeService.getRoutes({ perPage: 500 })
      return envelope.data ?? []
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useBuses() {
  return useQuery({
    queryKey: ['buses'],
    queryFn: async () => {
      const envelope = await routeService.getBuses({ perPage: 500 })
      return envelope.data ?? []
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useRouteManifest(routeId) {
  return useQuery({
    queryKey: ['routeManifest', routeId],
    queryFn: async () => {
      const envelope = await routeService.getRouteManifest(routeId, { perPage: 500 })
      return envelope.data ?? []
    },
    enabled: !!routeId,
    staleTime: 1000 * 60 * 2,
    refetchInterval: 1000 * 60 * 2,
    refetchOnWindowFocus: true,
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
