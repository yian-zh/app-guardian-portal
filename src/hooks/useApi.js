import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { routeService } from '@/services/routeService'
import { studentService } from '@/services/studentService'
import { billingService } from '@/services/billingService'
import { fetchAllPages } from '@/services/pagination'

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: () => fetchAllPages((params) => studentService.getStudents(params)),
    staleTime: 1000 * 60 * 5,
  })
}

export function useRoutes() {
  return useQuery({
    queryKey: ['routes'],
    queryFn: () => fetchAllPages((params) => routeService.getRoutes(params)),
    staleTime: 1000 * 60 * 5,
  })
}

export function useBuses() {
  return useQuery({
    queryKey: ['buses'],
    queryFn: () => fetchAllPages((params) => routeService.getBuses(params)),
    staleTime: 1000 * 60 * 5,
  })
}

export function useRouteManifest(routeId) {
  return useQuery({
    queryKey: ['routeManifest', routeId],
    queryFn: () =>
      fetchAllPages(
        (params) => routeService.getRouteManifest(routeId, params),
        { perPage: 200 }
      ),
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

export function useBillingLedger(guardianId) {
  return useQuery({
    queryKey: ['billingLedger', guardianId],
    queryFn: () => billingService.getLedger(guardianId),
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
