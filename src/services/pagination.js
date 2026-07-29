export async function fetchAllPages(fetchFn, { page = 1, perPage = 100 } = {}) {
  const envelope = await fetchFn({ page, perPage })

  if (Array.isArray(envelope)) return envelope

  const items = envelope.data ?? []
  const totalPages = envelope.last_page ?? envelope.meta?.last_page ?? 1

  if (page >= totalPages) return items

  const remainingPages = []
  for (let p = page + 1; p <= totalPages; p++) {
    remainingPages.push(fetchFn({ page: p, perPage }))
  }
  const results = await Promise.all(remainingPages)

  return results.reduce((acc, env) => {
    const pageItems = env.data ?? []
    return acc.concat(pageItems)
  }, items)
}
