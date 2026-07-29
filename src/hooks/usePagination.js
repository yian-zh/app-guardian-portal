import { useSearchParams } from 'react-router-dom'
import { useCallback, useMemo } from 'react'

export function usePagination({ perPage: defaultPerPage = 50, paramPrefix = '' } = {}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const pageKey = paramPrefix ? `${paramPrefix}Page` : 'page'
  const perPageKey = paramPrefix ? `${paramPrefix}PerPage` : 'perPage'

  const page = parseInt(searchParams.get(pageKey), 10) || 1
  const perPage = parseInt(searchParams.get(perPageKey), 10) || defaultPerPage

  const goToPage = useCallback((p) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (p <= 1) {
        next.delete(pageKey)
      } else {
        next.set(pageKey, String(p))
      }
      return next
    })
  }, [setSearchParams, pageKey])

  const goNext = useCallback(() => goToPage(page + 1), [goToPage, page])
  const goPrev = useCallback(() => goToPage(Math.max(1, page - 1)), [goToPage, page])

  return useMemo(() => ({
    page,
    perPage,
    goToPage,
    goNext,
    goPrev,
    offset: (page - 1) * perPage,
  }), [page, perPage, goToPage, goNext, goPrev])
}
